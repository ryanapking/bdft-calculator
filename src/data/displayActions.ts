import { AppDispatch, RootState } from './store.ts';
import { clearPendingDelete } from './displaySlice.ts';
import { getDataTypeFromId, GROUP, MATERIAL, PART, PROJECT } from './dataTypes.ts';
import { deletePart } from './partActions.ts';
import { deleteGroup } from './groupActions.ts';
import { deleteProject, removeMaterialFromProject } from './projectActions.ts';

export function processPendingDelete() {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    const pendingDelete = getState().display.pendingDelete;
    dispatch(clearPendingDelete());

    switch(getDataTypeFromId(pendingDelete.id)) {
      case PART:
        dispatch(deletePart(pendingDelete.parentId, pendingDelete.id));
        break;
      case GROUP:
        dispatch(deleteGroup(pendingDelete.parentId, pendingDelete.id));
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