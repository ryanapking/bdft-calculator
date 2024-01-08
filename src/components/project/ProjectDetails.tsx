import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../data/store.ts';
import ProjectTable from './table/ProjectTable.tsx';
import { useState } from 'react';
import ProjectForm from './ProjectForm.tsx';
import { Dropdown } from 'flowbite-react';
import { setPendingDelete } from '../../data/displaySlice.ts';
import { exportProject, saveProjectUpdates } from '../../data/projectActions.ts';
import { CiEdit, CiExport, CiTrash } from 'react-icons/ci';
import TextInputModal from '../inputs/TextInputModal.tsx';

function ProjectDetails(props: {projectId: string}) {
  const { projectId } = props;
  const project = useSelector((state: RootState) => state.projects.entities[projectId]);
  const defaultMaterial = useSelector((state: RootState) => state.materials.entities[project.defaultMaterial]);
  const dispatch = useAppDispatch();

  const [ editTitle, setEditTitle ] = useState(false);

  return (
    <div>
      <Dropdown className='text-3xl' inline label={<h1 className='text-3xl font-semibold'>{project.title}</h1>}>
        <Dropdown.Item icon={CiEdit} onClick={() => setEditTitle(true)}>Edit Project Title</Dropdown.Item>
        <Dropdown.Item icon={CiExport} onClick={() => dispatch(exportProject(projectId))}>Export Project</Dropdown.Item>
        <Dropdown.Item icon={CiTrash} onClick={() => dispatch(setPendingDelete({ id: projectId, parentId: '' }))}>
          Delete Project
        </Dropdown.Item>
      </Dropdown>
      <h5 className='text-xs font-light mb-5'>Project</h5>
      <div className='mt-5'>
        <p className='text-xs font-light'>Default material:</p>
        <p className='text-xl'>{defaultMaterial.title}</p>
      </div>

      <ProjectForm projectId={projectId} />
      <div className='pt-12'>
        <ProjectTable projectId={projectId}/>
      </div>

      {editTitle ?
        <TextInputModal
          submitText='Save'
          initialText={project.title}
          close={() => setEditTitle(false)}
          onSubmit={title => dispatch(saveProjectUpdates(projectId, {title}))}
        >
          <h3 className='text-3xl font-semibold mb-3'>Edit Project Title</h3>
        </TextInputModal>
        : null
      }
    </div>
  );
}

export default ProjectDetails;