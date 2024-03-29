import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../data/store.ts';
import ModalConfirm from './inputs/ModalConfirm.tsx';
import { clearAlert, clearPendingBulkDelete, clearPendingDelete, setCreating } from '../data/displaySlice.ts';
import { getDataTypeFromId } from '../data/dataTypes.ts';
import { processPendingBulkDelete, processPendingDelete } from '../data/displayActions.ts';
import { deleteMessages } from '../data/messages.ts';
import ImportModal from './project/import/ImportModal.tsx';
import TextInputModal from './inputs/TextInputModal.tsx';
import { addProject } from '../data/projectActions.ts';

function GlobalModal() {
  const pendingDelete = useSelector((state: RootState) => state.display.pendingDelete);
  const pendingBulkDelete = useSelector((state: RootState) => state.display.pendingBulkDelete);
  const alert = useSelector((state: RootState) => state.display.alert);
  const importing = useSelector((state: RootState) => state.display.importing);
  const creating = useSelector((state: RootState) => state.display.creating);
  const dispatch = useAppDispatch();

  if (alert) return (
    <ModalConfirm excludeConfirm openModal={true} onCancel={() => dispatch(clearAlert())}>{alert}</ModalConfirm>
  );

  if (pendingDelete.id) return (
    <ModalConfirm openModal={true} onConfirm={() => dispatch(processPendingDelete())} onCancel={() => dispatch(clearPendingDelete())}>
      {deleteMessages[getDataTypeFromId(pendingDelete.id).idPrefix]}
    </ModalConfirm>
  );

  if (pendingBulkDelete.length) return (
    <ModalConfirm openModal={true} onConfirm={() => dispatch(processPendingBulkDelete())} onCancel={() => dispatch(clearPendingBulkDelete())}>
      Are you sure you want to delete these {pendingBulkDelete.length === 1 ? 'this item' : `these ${pendingBulkDelete.length} items`}?
    </ModalConfirm>
  );

  if (importing) return (
    <ImportModal />
  );

  if (creating) return (
    <TextInputModal
      submitText='Create'
      inputLabel='Title'
      close={() => dispatch(setCreating(false))}
      onSubmit={title => dispatch(addProject(title))}
    >
      <h1 className='text-3xl font-semibold mb-3'>Create a Project</h1>
    </TextInputModal>
  );

  return null;
}

export default GlobalModal;