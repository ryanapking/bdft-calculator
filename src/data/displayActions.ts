import { AppDispatch, RootState } from './store.ts';
import { clearPendingBulkDelete, clearPendingDelete } from './displaySlice.ts';
import { getDataTypeFromId, GROUP, MATERIAL, PART, PROJECT } from './dataTypes.ts';
import { deletePart } from './partActions.ts';
import { deleteGroup } from './groupActions.ts';
import { deleteProject, recalculateActiveProject, removeMaterialFromProject } from './projectActions.ts';

export function processPendingDelete() {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    const pendingDelete = getState().display.pendingDelete;
    dispatch(clearPendingDelete());

    switch(getDataTypeFromId(pendingDelete.id)) {
      case PART:
        dispatch(deletePart(pendingDelete.parentId, pendingDelete.id));
        dispatch(recalculateActiveProject());
        break;
      case GROUP:
        dispatch(deleteGroup(pendingDelete.parentId, pendingDelete.id));
        dispatch(recalculateActiveProject());
        break;
      case MATERIAL:
        dispatch(removeMaterialFromProject(pendingDelete.id, pendingDelete.parentId));
        break;
      case PROJECT:
        dispatch(deleteProject(pendingDelete.id));
        break;
    }
  };
}

export function processPendingBulkDelete() {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState();
    const bulkDelete = state.display.pendingBulkDelete;

    // Remove any duplicates that will be deleted by removing their parent
    const fullDeleteList = bulkDelete.map(item => item.id);
    const reducedDeletes = bulkDelete.filter(item => !fullDeleteList.includes(item.parentId));

    // Delete parts
    const partDeletions = reducedDeletes.filter(item => getDataTypeFromId(item.id) === PART);
    partDeletions.forEach(item => dispatch(deletePart(item.parentId, item.id)));

    // Delete groups
    const groupDeletions = reducedDeletes.filter(item => getDataTypeFromId(item.id) === GROUP);
    groupDeletions.forEach(item => dispatch(deleteGroup(item.parentId, item.id)));

    dispatch(recalculateActiveProject());
    dispatch(clearPendingBulkDelete());
  }
}