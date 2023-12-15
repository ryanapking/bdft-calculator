import { AppDispatch, RootState } from './store.ts';
import { create as createPart, destroy as destroyPart } from './partsSlice.ts';
import { create as createGroup, destroy as destroyGroup, addChild, removeChild } from './groupsSlice.ts';
import { create as createProject, destroy as destroyProject, addMaterial } from './projectsSlice.ts';
import { create as createMaterial, destroy as destroyMaterial } from './materialsSlice.ts';
import {
  setActiveProject,
  clearActiveDetailsIf,
  setActiveTableData,
  RecursiveChild,
  MaterialList,
  MaterialSummary
} from './displaySlice.ts';
import { PROJECT, GROUP, PART, MATERIAL, getId, getDataTypeFromId } from './dataTypes.ts';

export function addProject() {
  return (dispatch: AppDispatch) => {
    const groupId = getId(GROUP);
    dispatch(createGroup(groupId));

    const materialId = getId(MATERIAL);
    dispatch(createMaterial(materialId));

    const projectId = getId(PROJECT);
    dispatch(createProject({projectId, groupId, materialId}));

    dispatch(setActiveProject(projectId));
  };
}

export function addMaterialToProject(projectId: string) {
  return (dispatch: AppDispatch) => {
    const materialId = getId(MATERIAL);
    dispatch(createMaterial(materialId));

    dispatch(addMaterial({projectId, materialId}));
  };
}

export function addPart(parentId: string) {
  return (dispatch: AppDispatch) => {
    const partId = getId(PART);
    dispatch(createPart(partId));

    dispatch(addChild({
      groupId: parentId,
      childId: partId
    }));
  };
}

export function addGroup(parentId: string) {
  return (dispatch: AppDispatch) => {
    const groupId = getId(GROUP);
    dispatch(createGroup(groupId));

    dispatch(addChild({
      groupId: parentId,
      childId: groupId
    }));
  };
}

export function deletePart(groupId: string, partId: string) {
  return (dispatch: AppDispatch) => {
    dispatch(clearActiveDetailsIf(partId));
    dispatch(removeChild({ groupId, childId: partId }));
    dispatch(destroyPart(partId));
  }
}

function gatherChildren(groupId: string, state: RootState) {
  let children: Array<string> = [];

  state.groups.all[groupId].children.forEach((childId) => {
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
    dispatch(removeChild({groupId: parentId, childId: groupId}));

    const children = gatherChildren(groupId, getState());

    const childParts = children.filter(id => getDataTypeFromId(id) === PART);
    dispatch(destroyPart(childParts));

    const childGroups = children.filter(id => getDataTypeFromId(id) === GROUP);
    dispatch(destroyGroup([groupId, ...childGroups]));
  }
}

export function deleteProject(projectId: string) {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(clearActiveDetailsIf(projectId));

    const state = getState();
    const mainGroupId = state.projects.all[projectId].mainGroup;
    const materials = state.projects.all[projectId].materials;

    dispatch(destroyProject(projectId));
    dispatch(destroyMaterial(materials));

    const children = gatherChildren(mainGroupId, state);

    const childParts = children.filter(id => getDataTypeFromId(id) === PART);
    dispatch(destroyPart(childParts));

    const childGroups = children.filter(id => getDataTypeFromId(id) === GROUP);
    dispatch(destroyGroup([mainGroupId, ...childGroups]));
  }
}

function combineMaterials(m1: MaterialSummary, m2: MaterialSummary, qty: number): MaterialSummary {
  const updatedBdft = m1.bdft + m2.bdft;
  const updatedCost = m1.cost + m2.cost;
  return {
    id: m1.id,
    bdft: updatedBdft,
    cost: updatedCost,
    totalBdft: +(updatedBdft * qty).toFixed(3),
    totalCost: +(updatedCost * qty).toFixed(2),
  };
}

export function updateActiveTable() {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState();
    const activeProjectId = state.display.activeProject;
    if (!activeProjectId) return;

    console.log('updating activeTableData....')

    const activeProject =  state.projects.all[activeProjectId];
    const groups = state.groups.all;
    const parts = state.parts.all;
    const materials = state.materials.all;

    const processGroup = (groupId: string): RecursiveChild => {
      const group = groups[groupId];

      const children = group.children.map(childId => {
        switch (getDataTypeFromId(childId)) {
          case PART: return processPart(childId);
          default: return processGroup(childId);
        }
      });

      const groupMaterials: MaterialList = children
        .flatMap(child => Object.values(child.materials))
        .reduce((list: MaterialList, current) => {
          return {
            ...list,
            [current.id]: (current.id in list) ? combineMaterials(current, list[current.id], group.qty) : current
          };
        }, {});

      return {
        type: GROUP,
        children: children,
        id: groupId,
        title: group.title,
        qty: group.qty,
        materials: groupMaterials,
      };
    };

    const processPart = (partId: string): RecursiveChild => {
      const part = parts[partId];
      const materialId = part.m ? part.m : activeProject.defaultMaterial;
      const material = materials[materialId];

      const bdft = +((part.l * part.w * material.thickness) / 144).toFixed(3);
      const cost = +(bdft * material.cost).toFixed(2);

      const totalBdft = +(bdft * part.qty).toFixed(3);
      const totalCost = +(totalBdft * material.cost).toFixed(2);

      return {
        type: PART,
        id: partId,
        title: part.title,
        qty: part.qty,
        materials: {
          [materialId]: {
            id: materialId,
            bdft,
            cost,
            totalBdft,
            totalCost,
          }
        },
        children: [],
      };
    };

    const tableData = processGroup(activeProject.mainGroup);
    dispatch(setActiveTableData(tableData));
  }
}