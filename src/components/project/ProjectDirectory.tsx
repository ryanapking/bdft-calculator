import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../data/store.ts';
import { setActiveDetails } from '../../data/displaySlice.ts';
import MaterialSummary from '../material/MaterialSummary.tsx';
import GroupDirectory from '../group/GroupDirectory.tsx';
import { Dropdown } from 'flowbite-react';
import { addMaterialToProject } from '../../data/projectActions.ts';
import { RxPlusCircled } from 'react-icons/rx';

function ProjectDirectory(props: { projectId: string }) {
  const { projectId } = props;
  const project = useSelector((state: RootState) => state.projects.entities[projectId]);

  const dispatch = useAppDispatch();

  if (!project) return null;

  return (
    <div className='text-lg font-light'>
      <div className='sticky top-0 bg-white py-3 border-b'>
        <h2 className='hover:cursor-pointer hover:underline text-lg font-semibold' onClick={() => dispatch(setActiveDetails({ id: projectId, parentId: '' }))}>{project.title}</h2>
      </div>

      <div className='mt-3'>
        <Dropdown inline label={<h3 className='font-semibold'>Materials</h3>}>
          <Dropdown.Item icon={RxPlusCircled} onClick={() => dispatch(addMaterialToProject(projectId, project.materials))}>Add
            Material</Dropdown.Item>
        </Dropdown>
        {project.materials.map(materialId => (
          <MaterialSummary key={materialId} materialId={materialId} projectId={projectId} groupId={project.mainGroup}/>
        ))}
        <MaterialSummary materialId={project.miscMaterial} projectId={projectId} groupId={project.mainGroup}/>
      </div>

      <div className='mt-3'>
        <h3 className='font-semibold hover:cursor-pointer hover:underline'
            onClick={() => dispatch(setActiveDetails({ id: project.mainGroup, parentId: projectId }))}>Components</h3>
        <GroupDirectory excludeGroupTitle groupId={project.mainGroup} parentId={projectId}/>
      </div>
    </div>
  )
}

export default ProjectDirectory;