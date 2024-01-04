import { Button, Modal } from 'flowbite-react';
import { importProject, importProjectAsNew, ProjectExport } from '../../../data/projectActions.ts';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../../data/store.ts';
import { endImport } from '../../../data/displaySlice.ts';

function ImportConfirm(props: { projectImport: ProjectExport }) {
  const { projectImport } = props;
  const dispatch = useAppDispatch();
  const existingProject = useSelector((state: RootState) => state.projects.entities?.[projectImport.project.id]);

  if (existingProject) return (
    <Modal.Body className='flex flex-col gap-8'>
      <div className='flex flex-col gap-6'>
        <p>The project you are importing matches a pre-existing project. How would you like to proceed?</p>
        <div>
          <p className='text-xs'>Existing project:</p>
          <p className='text-xl font-semibold'>{existingProject.title}</p>
        </div>
        <div>
          <p className='text-xs'>Importing project:</p>
          <p className='text-xl font-semibold'>{projectImport.project.title}</p>
        </div>
      </div>
      <div className='grid grid-cols-3 gap-3'>
        <Button color='success' onClick={() => dispatch(importProjectAsNew(projectImport))}>Keep Both Projects</Button>
        <Button color='warning' onClick={() => dispatch(importProject(projectImport))}>Replace Existing Project</Button>
        <Button color='gray' onClick={() => dispatch(endImport())}>Cancel Import</Button>
      </div>
    </Modal.Body>
  );

  return (
    <Modal.Body className='flex flex-col gap-8'>
      <div className='flex flex-col gap-6'>
        <p>Importing project:</p>
        <p className='text-xl font-semibold'>{projectImport.project.title}</p>
      </div>
      <div className='grid grid-cols-2 gap-3'>
        <Button color='success' onClick={() => dispatch(importProject(projectImport))}>Confirm Import</Button>
        <Button color='gray' onClick={() => dispatch(endImport())}>Cancel Import</Button>
      </div>
    </Modal.Body>
  );
}

export default ImportConfirm;