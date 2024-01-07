import MaterialListSortable from '../material/MaterialListSortable.tsx';
import { useSelector } from 'react-redux';
import { RootState } from '../../data/store.ts';

function ProjectMaterialDetails() {
  const project = useSelector((state: RootState) => state.projects.entities[state.display.activeProject]);

  return (
    <div className='max-w-5xl'>
      <h1 className='text-3xl font-semibold mb-6'>Project Materials</h1>
      <MaterialListSortable projectId={project.id} list={project.materials} />
    </div>
  );
}

export default ProjectMaterialDetails;