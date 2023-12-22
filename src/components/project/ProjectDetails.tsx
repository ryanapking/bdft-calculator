import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../data/store.ts';
import ProjectTable from './ProjectTable.tsx';
import { useState } from 'react';
import ProjectForm from './ProjectForm.tsx';
import { Button, Dropdown } from 'flowbite-react';
import { setPendingDelete } from '../../data/displaySlice.ts';

function ProjectDetails(props: {projectId: string}) {
  const { projectId } = props;
  const project = useSelector((state: RootState) => state.projects.entities[projectId]);
  const defaultMaterial = useSelector((state: RootState) => state.materials.entities[project.defaultMaterial]);
  const dispatch = useAppDispatch();

  const [ showForm, setShowForm ] = useState(false);

  const projectForm = (
    <div>
      <ProjectForm projectId={projectId} />
      <Button size='xs' className='mt-5' onClick={() => setShowForm(false)}>Stop Editing</Button>
    </div>
  );

  const projectInfo = (
    <div className='mt-5'>
      <p className='text-sm'>Default material:</p>
      <p className='text-xl'>{defaultMaterial.title}</p>
    </div>
  );

  return (
    <div>
      <div className='flex mb-5'>
        <Dropdown className='text-3xl' inline label={<h1 className='text-3xl'>{project.title}</h1>}>
          <Dropdown.Item onClick={() => setShowForm(true)}>Edit Project</Dropdown.Item>
          <Dropdown.Divider/>
          <Dropdown.Item onClick={() => dispatch(setPendingDelete({id: projectId, parentId: ''}))}>Delete Project</Dropdown.Item>
        </Dropdown>
      </div>
      {showForm ? projectForm : projectInfo}

      <div className='pt-12'>
        <ProjectTable projectId={projectId}/>
      </div>
    </div>
  );
}

export default ProjectDetails;