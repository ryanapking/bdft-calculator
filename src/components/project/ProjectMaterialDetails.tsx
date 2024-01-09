import MaterialListSortable from '../material/MaterialListSortable.tsx';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../data/store.ts';
import { Button } from 'flowbite-react';
import { addMaterialToProject } from '../../data/projectActions.ts';

function ProjectMaterialDetails() {
  const project = useSelector((state: RootState) => state.projects.entities[state.display.activeProject]);
  const dispatch = useAppDispatch();

  return (
    <div className='max-w-5xl'>
      <h1 className='text-3xl font-semibold'>Project Materials</h1>
      <h5 className='text-xs font-light mb-5'>Material List</h5>
      <div
        className='grid grid-cols-12 gap-3 pl-[3.75rem] pr-[1rem] font-semibold items-end border border-transparent mb-1 text-center'>
        <div className='col-start-4 col-span-2'>Type</div>
        <div className='col-span-2'>Thickness</div>
        <div className='col-span-2'>Waste Factor</div>
        <div className='col-span-2'>Cost</div>
        <div className='text-center'>Default</div>
      </div>
      <MaterialListSortable projectId={project.id} list={project.materials}/>
      <Button className='mt-6' color='gray' onClick={() => dispatch(addMaterialToProject(project.id, false))}>Add Material</Button>
    </div>
  );
}

export default ProjectMaterialDetails;