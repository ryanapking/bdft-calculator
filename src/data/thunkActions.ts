import { AppDispatch, RootState } from './store.ts';
import { create as createPart, destroy as destroyPart } from './partsSlice.ts';
import { create as createGroup, destroy as destroyGroup, addChild, removeChild } from './groupsSlice.ts';
import { create as createProject, destroy as destroyProject } from './projectsSlice.ts';
import { setActiveProject } from './displaySlice.ts';
import { PROJECT, GROUP, PART, getId, getDataTypeFromId } from './dataTypes.ts';

export function addProject() {
  return (dispatch: AppDispatch) => {
    const groupId = getId(GROUP);
    dispatch(createGroup(groupId));

    const projectId = getId(PROJECT);
    dispatch(createProject({projectId, groupId}));

    dispatch(setActiveProject(projectId));
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
    dispatch(removeChild({groupId: parentId, childId: groupId}));

    const children = gatherChildren(groupId, getState());

    const childParts = children.filter(id => getDataTypeFromId(id) === PART);
    dispatch(destroyPart(childParts));

    const childGroups = children.filter(id => getDataTypeFromId(id) === GROUP);
    dispatch(destroyGroup([groupId, ...childGroups]));
  }
}

export function deleteProject(projectId: string, mainGroupId: string) {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(destroyProject(projectId));

    const children = gatherChildren(mainGroupId, getState());

    const childParts = children.filter(id => getDataTypeFromId(id) === PART);
    dispatch(destroyPart(childParts));

    const childGroups = children.filter(id => getDataTypeFromId(id) === GROUP);
    dispatch(destroyGroup([mainGroupId, ...childGroups]));
  }
}