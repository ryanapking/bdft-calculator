import { AppDispatch, RootState } from './store.ts';
import {
  Group,
  addChild,
  removeChild,
  create as createGroup,
  update as updateGroup,
  updateMany as updateManyGroups,
  destroyMany as destroyManyGroups,
} from './groupsSlice.ts';
import { clearActiveDetailsIf } from './displaySlice.ts';
import { MaterialList, MaterialUsageSummary } from './materialsSlice.ts';
import { destroyMany as destroyManyParts, updateMany as updateManyParts } from './partsSlice.ts';
import { calculatePart, getPartMaterial } from './partActions.ts';
import { getDataTypeFromId, getId, GROUP, PART } from './dataTypes.ts';
import { recalculateActiveProject } from './projectActions.ts';

export function getEmptyGroup(): Group {
  return {
    id: getId(GROUP),
    title: 'New Group',
    children: [],
    qty: 1,
    calc: {
      totalCost: 0,
      list: {},
    }
  };
}

export function addGroup(parentId: string) {
  return (dispatch: AppDispatch) => {
    const group = getEmptyGroup();
    dispatch(createGroup(group));

    dispatch(addChild({ groupId: parentId, childId: group.id }));
  }
}

type GroupUpdate = {
  id: string,
  changes: Omit<Group, 'id' | 'children' | 'calc'>
};

export function saveGroupUpdates(updates: GroupUpdate) {
  return (dispatch: AppDispatch) => {
    dispatch(updateGroup(updates));
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
  const combinedLists = Object.values(l1.list)
    .reduce((runningList: { [key: string] : MaterialUsageSummary }, current: MaterialUsageSummary) => {
      if (current.id in runningList) {
        return { ...runningList, [current.id]: combineUsage(current, runningList[current.id]) };
      }
      return { ...runningList, [current.id]: current };
    }, l2.list);

  return {
    totalCost: +(l1.totalCost + l2.totalCost).toFixed(2),
    list: combinedLists,
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
  return Object.values(list.list)
    .reduce((runningList: MaterialList, current: MaterialUsageSummary): MaterialList => {
      const newSummary = multiplyMaterialUsageSummary(current, qty);
      return {
        totalCost: runningList.totalCost + newSummary.cost,
        list: { ...runningList.list, [newSummary.id]: newSummary },
      };
    }, {totalCost: 0, list: {}});
}

function calculateGroup(children: Array<PartCalcChanges | GroupCalcChanges>): MaterialList {
  return children.reduce((runningList: MaterialList, child) => {
    const multiple = multiplyMaterialList(child.changes.calc, child.changes.qty);
    return combineMaterialLists(multiple, runningList);
  }, {totalCost: 0, list: {}});
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