import { Modal } from 'flowbite-react';
import { useState } from 'react';
import { useAppDispatch } from '../../../data/store.ts';
import { endImport } from '../../../data/displaySlice.ts';
import { ProjectExport } from '../../../data/projectActions.ts';
import ImportConfirm from './ImportConfirm.tsx';
import ImportSelect from './ImportSelect.tsx';

function ImportModal() {
  const [ projectImport, setProjectImport ] = useState<ProjectExport|null>(null);
  const dispatch = useAppDispatch();

  return (
    <Modal show={true} size='xl' popup onClose={() => dispatch(endImport())}>
      <Modal.Header />
      { projectImport
        ? <ImportConfirm projectImport={projectImport} />
        : <ImportSelect setProjectImport={setProjectImport} />
      }
    </Modal>
  );
}

export default ImportModal;