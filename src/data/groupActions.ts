import {
  Group,
  addChild,
  removeChild,
  create as createGroup,
  destroyMany as destroyManyGroups
} from './groupsSlice.ts';
import { getDataTypeFromId, getId, GROUP, PART } from './dataTypes.ts';
import { AppDispatch, RootState } from './store.ts';
import { clearActiveDetailsIf } from './displaySlice.ts';
import { destroyMany as destroyManyParts } from './partsSlice.ts';

export function getEmptyGroup(): Group {
  return {
    id: getId(GROUP),
    title: 'New Group',
    children: [],
    qty: 1,
  };
}

export function addGroup(parentId: string) {
  return (dispatch: AppDispatch) => {
    const group = getEmptyGroup();
    dispatch(createGroup(group));

    dispatch(addChild({ groupId: parentId, childId: group.id }));
  }
}

function gatherChildren(groupId: string, state: RootState) {
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
  }
}