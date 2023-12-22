import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../data/store.ts';
import { setActiveDetails } from '../../data/displaySlice.ts';
import MaterialSummary from '../material/MaterialSummary.tsx';
import GroupDirectory from '../group/GroupDirectory.tsx';
import { Dropdown } from 'flowbite-react';
import { addMaterialToProject } from '../../data/projectActions.ts';

function ProjectDirectory(props: { projectId: string }) {
  const { projectId } = props;
  const project = useSelector((state: RootState) => state.projects.entities[projectId]);

  const dispatch = useAppDispatch();

  if (!project) return null;

  return (
    <div className='text-xl mr-20'>
      <h1 className='hover:cursor-pointer hover:underline' onClick={() => dispatch(setActiveDetails({id: projectId, parentId: ''}))}>{project.title}</h1>
      <div className='mt-3'>
        <Dropdown inline label={<h3>Materials</h3>}>
          <Dropdown.Item onClick={() => dispatch(addMaterialToProject(projectId, project.materials))}>Add Material</Dropdown.Item>
        </Dropdown>
        {project.materials.map(materialId => <MaterialSummary key={materialId} materialId={materialId} projectId={projectId} groupId={project.mainGroup} /> )}
      </div>
      <div className='mt-3'>
        <GroupDirectory mainGroup altTitle='Components' groupId={project.mainGroup} parentId={projectId}/>
      </div>
    </div>
  )
}

export default ProjectDirectory;