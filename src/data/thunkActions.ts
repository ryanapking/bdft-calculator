import { AppDispatch } from './store.ts';
import { create as createPart } from './partsSlice.ts';
import { create as createGroup, addChild } from './groupsSlice.ts';
import { create as createProject } from './projectsSlice.ts';
import { PROJECT, GROUP, PART, getId } from './dataTypes.ts';

export function addProject() {
  console.log('createProject()');

  return (dispatch: AppDispatch) => {
    // create a group to serve as the project's main group
    const groupId = getId(GROUP);
    dispatch(createGroup(groupId));

    // create project
    const projectId = getId(PROJECT);
    dispatch(createProject({projectId, groupId}))
  };
}

export function addPart(parentId: string) {
  console.log('addPart()');
  console.log('parentId: ', parentId);

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
  console.log('addGroup()')
  console.log('parentId: ', parentId);

  return (dispatch: AppDispatch) => {
    const groupId = getId(GROUP);
    dispatch(createGroup(groupId));
    dispatch(addChild({
      groupId: parentId,
      childId: groupId
    }));
  };
}