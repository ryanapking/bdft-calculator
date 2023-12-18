import { AppDispatch } from './store.ts';
import { getId, PART } from './dataTypes.ts';
import { Part, create as createPart, destroy as destroyPart, update as updatePart } from './partsSlice.ts';
import { addChild, removeChild } from './groupsSlice.ts';
import { clearActiveDetailsIf } from './displaySlice.ts';

function getEmptyPart(): Part {
  return {
    id: getId(PART),
    title: 'New Part',
    qty: 1,
    l: 12,
    w: 3,
    h: 1,
    m: '',
  };
}

export function addPart(parentId: string) {
  return (dispatch: AppDispatch) => {
    const newPart = getEmptyPart();
    dispatch(createPart(newPart));

    dispatch(addChild({
      groupId: parentId,
      childId: newPart.id
    }));
  };
}

type PartUpdate = {
  id: string,
  changes: Omit<Part, 'id'>
};

export function savePartUpdates(updates: PartUpdate) {
  return (dispatch: AppDispatch) => {
    dispatch(updatePart(updates));
    // TODO: trigger calculation
  };
}

export function deletePart(groupId: string, partId: string) {
  return (dispatch: AppDispatch) => {
    dispatch(clearActiveDetailsIf(partId));
    dispatch(removeChild({ groupId, childId: partId }));
    dispatch(destroyPart(partId));
  };
}
