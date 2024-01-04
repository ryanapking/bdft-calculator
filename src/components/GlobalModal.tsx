import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../data/store.ts';
import ModalConfirm from './inputs/ModalConfirm.tsx';
import { clearAlert, clearPendingDelete } from '../data/displaySlice.ts';
import { getDataTypeFromId } from '../data/dataTypes.ts';
import { processPendingDelete } from '../data/displayActions.ts';
import { deleteMessages } from '../data/messages.ts';
import ImportModal from './project/import/ImportModal.tsx';

function GlobalModal() {
  const pendingDelete = useSelector((state: RootState) => state.display.pendingDelete);
  const alert = useSelector((state: RootState) => state.display.alert);
  const importing = useSelector((state: RootState) => state.display.importing);
  const dispatch = useAppDispatch();

  if (alert) return (
    <ModalConfirm excludeConfirm openModal={true} onCancel={() => dispatch(clearAlert())}>{alert}</ModalConfirm>
  );

  if (pendingDelete.id) return (
    <ModalConfirm openModal={true} onConfirm={() => dispatch(processPendingDelete())} onCancel={() => dispatch(clearPendingDelete())}>
      {deleteMessages[getDataTypeFromId(pendingDelete.id).idPrefix]}
    </ModalConfirm>
  );

  if (importing) return (
    <ImportModal />
  )

  return null;
}

export default GlobalModal;