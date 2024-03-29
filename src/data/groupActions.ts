import { AppDispatch, RootState } from './store.ts';
import {
  Group,
  GroupPartial,
  addChild,
  removeChild,
  create as createGroup,
  createMany as createManyGroups,
  update as updateGroup,
  updateMany as updateManyGroups,
  destroyMany as destroyManyGroups,
} from './groupsSlice.ts';
import {
  Part,
  destroyMany as destroyManyParts,
  updateMany as updateManyParts,
  createMany as createManyParts,
} from './partsSlice.ts';
import { clearActiveDetailsIf, setActiveDetails } from './displaySlice.ts';
import { MaterialList, MaterialUsageSummary } from './materialsSlice.ts';
import { calculatePart, getPartMaterial } from './partActions.ts';
import { getDataTypeFromId, getId, GROUP, PART } from './dataTypes.ts';
import { recalculateActiveProject } from './projectActions.ts';

export function getEmptyGroup(): Group {
  return {
    id: getId(GROUP),
    title: 'New Group',
    children: [],
    qty: 1,
    notes: '',
    calc: {
      totalCost: 0,
      ids: [],
      entities: {},
    }
  };
}

export function addGroup(parentId: string, atIndex: number = -1, redirect: boolean = true) {
  return (dispatch: AppDispatch) => {
    const group = getEmptyGroup();
    dispatch(createGroup(group));

    dispatch(addChild({
      groupId: parentId,
      childId: group.id,
      atIndex,
    }));

    if (redirect) dispatch(setActiveDetails({id: group.id, parentId}));
  }
}

export function duplicateGroup(parentId: string, groupId: string) {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState();

    const parentGroup = state.groups.entities[parentId];
    if (!parentGroup) return;

    const originalIndex = parentGroup.children.indexOf(groupId);
    if (originalIndex < 0) return;

    const children = gatherChildren(groupId, state);

    // Copy parts and store in a map
    const partList = children.filter(id => getDataTypeFromId(id) === PART);
    const partMap = partList.reduce((entities: { [key: string]: Part }, partId) => {
      entities[partId] = structuredClone(state.parts.entities[partId]);
      // entities[partId] = state.parts.entities[partId];
      entities[partId].id = getId(PART);
      return entities;
    }, {});

    // Copy groups and store in a map
    const groupList = children.filter(id => getDataTypeFromId(id) === GROUP);
    const groupMap = groupList.reduce((entities: { [key: string]: Group}, groupId) => {
      entities[groupId] = structuredClone(state.groups.entities[groupId]);
      // entities[groupId] = state.groups.entities[groupId];
      entities[groupId].id = getId(GROUP);
      return entities;
    }, {});

    // Copy and rename the parent group, add to our groups info
    const groupCopy = structuredClone(state.groups.entities[groupId]);
    groupCopy.title = `Copy of ${groupCopy.title}`;
    groupCopy.id = getId(GROUP);
    groupMap[groupId] = groupCopy;
    groupList.push(groupId);

    // Map the children of all groups to their copy IDs
    groupList.forEach(groupId => {
      groupMap[groupId].children = groupMap[groupId].children.map(originalId => {
        if (getDataTypeFromId(originalId) === PART) return partMap[originalId].id;
        return groupMap[originalId].id;
      });
    });

    // Add the main group copy to the original parent
    const parentChildren = [...parentGroup.children];
    parentChildren.splice(originalIndex, 0, groupMap[groupId].id);
    const parentUpdate = {
      id: parentId,
      changes: {
        children: parentChildren,
      }
    };

    dispatch(createManyParts(Object.values(partMap)));
    dispatch(createManyGroups(Object.values(groupMap)));
    dispatch(updateGroup(parentUpdate));
    dispatch(recalculateActiveProject());
  }
}

export function saveGroupUpdates(groupId: string, changes: GroupPartial) {
  return (dispatch: AppDispatch) => {
    const update = { id: groupId, changes };
    dispatch(updateGroup(update));
    dispatch(recalculateActiveProject());
  }
}

export type ChildRelocation = {
  id: string,
  oldParent: string,
  newParent: string,
  newIndex: number,
}

export function relocateChild(relocation: ChildRelocation) {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    // If provided parents aren't groups, cancel relocation
    if (getDataTypeFromId(relocation.oldParent) !== GROUP || getDataTypeFromId(relocation.newParent) !== GROUP) return;

    const allGroups = getState().groups.entities;
    const fromGroup = allGroups[relocation.oldParent];

    const newFromChildren = fromGroup.children.filter(id => id !== relocation.id);

    const updates = [];
    updates.push({
      id: fromGroup.id,
      changes: {
        children: newFromChildren,
      }
    });

    const toGroup = allGroups[relocation.newParent];
    const newToChildren = relocation.newParent === relocation.oldParent ? [...newFromChildren] : [...toGroup.children];
    newToChildren.splice(relocation.newIndex, 0, relocation.id);

    updates.push({
      id: toGroup.id,
      changes: {
        children: newToChildren,
      }
    });

    dispatch(updateManyGroups(updates));
    dispatch(recalculateActiveProject());
  }
}

export function gatherChildren(groupId: string, state: RootState) {
  let children: Array<string> = [];

  state.groups.entities[groupId].children.forEach((childId) => {
    children.push(childId);
    if (getDataTypeFromId(childId) === GROUP) {
      children = [...children, ...gatherChildren(childId, state)];
    }
  });

  return children;
}

export function deleteGroup(parentId: string, groupId: string) {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(clearActiveDetailsIf(groupId));

    if (getDataTypeFromId(parentId) === GROUP) {
      dispatch(removeChild({groupId: parentId, childId: groupId}));
    }

    const children = gatherChildren(groupId, getState());

    const childParts = children.filter(id => getDataTypeFromId(id) === PART);
    dispatch(destroyManyParts(childParts));

    const childGroups = children.filter(id => getDataTypeFromId(id) === GROUP);
    dispatch(destroyManyGroups([groupId, ...childGroups]));
  };
}

type GroupCalcChanges = {
  id: string,
  changes: {
    qty: number,
    calc: MaterialList,
  }
}

type PartCalcChanges = {
  id: string,
  changes: {
    qty: number,
    calc: MaterialList,
  }
}

function combineUsage(s1: MaterialUsageSummary, s2: MaterialUsageSummary): MaterialUsageSummary {
  return {
    id: s1.id,
    type: s1.type,
    amt: +((s1.amt + s2.amt).toFixed(3)),
    cost: +((s1.cost + s2.cost).toFixed(2)),
  };
}

function combineMaterialLists(l1: MaterialList, l2: MaterialList): MaterialList {
  const combinedEntities = l1.ids.reduce((runningList: { [key: string] : MaterialUsageSummary }, currentId: string) => {
    if (currentId in runningList) {
      return { ...runningList, [currentId]: combineUsage(l1.entities[currentId], runningList[currentId]) };
    }
    return { ...runningList, [currentId]: l1.entities[currentId] };
  }, l2.entities);

  return {
    totalCost: +(l1.totalCost + l2.totalCost).toFixed(2),
    ids: [...new Set([...l1.ids, ...l2.ids])],
    entities: combinedEntities,
  };
}

function multiplyMaterialUsageSummary(summary: MaterialUsageSummary, qty: number): MaterialUsageSummary {
  if (qty === 1) return summary;
  return {
    id: summary.id,
    type: summary.type,
    amt: +(summary.amt * qty).toFixed(3),
    cost: +(summary.cost * qty).toFixed(2),
  };
}

function multiplyMaterialList(list: MaterialList, qty: number): MaterialList {
  return list.ids.reduce((runningList: MaterialList, currentId: string): MaterialList => {
    const current = list.entities[currentId];
    const newSummary = multiplyMaterialUsageSummary(current, qty);
    return {
      totalCost: runningList.totalCost + newSummary.cost,
      ids: [...runningList.ids, currentId],
      entities: { ...runningList.entities, [newSummary.id]: newSummary },
    };
  }, {totalCost: 0, ids: [], entities: {}});
}

function sortMaterialsByCost(list: MaterialList): MaterialList {
  const sortedIds = list.ids.sort((a, b) => list.entities[a].cost - list.entities[b].cost)
  return {
    ...list,
    ids: sortedIds,
  };
}

function calculateGroup(children: Array<PartCalcChanges | GroupCalcChanges>): MaterialList {
  return children.reduce((runningList: MaterialList, child) => {
    const multiple = multiplyMaterialList(child.changes.calc, child.changes.qty);
    const combined = combineMaterialLists(multiple, runningList);
    return sortMaterialsByCost(combined);
  }, {totalCost: 0, ids: [], entities: {}});
}

export function recalculateGroup(groupId: string) {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState();
    const allPartChanges: Array<PartCalcChanges> = [];
    const allGroupChanges: Array<GroupCalcChanges> = [];

    const processPart = (partId: string): PartCalcChanges => {
      const part = state.parts.entities[partId];
      const material = getPartMaterial(part, state);

      const partChanges = {
        id: part.id,
        changes: {
          qty: part.qty,
          calc: calculatePart(part, material),
        }
      };

      allPartChanges.push(partChanges);
      return partChanges;
    };

    const processGroup = (groupId: string): GroupCalcChanges => {
      const group = state.groups.entities[groupId];

      const children = group.children.map((childId) => {
        switch (getDataTypeFromId(childId)) {
          case GROUP: return processGroup(childId);
          default: return processPart(childId);
        }
      });

      const groupChanges = {
        id: groupId,
        changes: {
          qty: group.qty,
          calc: calculateGroup(children),
        }
      };

      allGroupChanges.push(groupChanges);
      return groupChanges;
    };

    processGroup(groupId);

    console.log("allPartChanges: ", allPartChanges);
    console.log('allGroupChanges: ', allGroupChanges);

    dispatch(updateManyParts(allPartChanges));
    dispatch(updateManyGroups(allGroupChanges));
  };
}