import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../data/store.ts';
import { setActiveDetails } from '../../data/displaySlice.ts';
import MaterialSummary from '../material/MaterialSummary.tsx';
import GroupDirectory from '../group/GroupDirectory.tsx';
import { addMaterialToProject } from '../../data/projectActions.ts';
import { RxPlus } from 'react-icons/rx';
import GroupActionIcons from '../group/GroupActionIcons.tsx';

function ProjectDirectory(props: { projectId: string }) {
  const { projectId } = props;
  const project = useSelector((state: RootState) => state.projects.entities[projectId]);

  const dispatch = useAppDispatch();

  if (!project) return null;

  return (
    <div className='text-lg font-light'>
      <div className='sticky top-0 bg-white py-3 border-b'>
        <h2
          className='hover:cursor-pointer hover:underline text-lg font-semibold'
          onClick={() => dispatch(setActiveDetails({ id: projectId, parentId: '' }))}
        >
          {project.title}
        </h2>
      </div>

      <div className='mt-3'>
        <div className='flex justify-between'>
          <h3
            className='font-semibold hover:cursor-pointer hover:underline'
            onClick={() => dispatch(setActiveDetails({id: 'materials', parentId: projectId}))}
          >
            Materials
          </h3>
          <button
            title='add material'
            className='hover:bg-gray-200 hover:cursor-pointer px-1 text-sm'
            onClick={() => dispatch(addMaterialToProject(projectId, project.materials))}
          >
            <RxPlus/>
          </button>
        </div>

        {project.materials.map(materialId => (
          <MaterialSummary key={materialId} materialId={materialId} projectId={projectId} groupId={project.mainGroup}/>
        ))}
        <MaterialSummary materialId={project.miscMaterial} projectId={projectId} groupId={project.mainGroup}/>
      </div>

      <div className='mt-3'>
        <div className='flex'>
          <h3
            className='font-semibold hover:cursor-pointer hover:underline flex items-center gap-3 w-full'
            onClick={() => dispatch(setActiveDetails({ id: project.mainGroup, parentId: projectId }))}
          >
            Components
          </h3>
          <GroupActionIcons groupId={project.mainGroup} />
        </div>

        <GroupDirectory excludeGroupTitle groupId={project.mainGroup} parentId={projectId}/>
      </div>
    </div>
  )
}

export default ProjectDirectory;