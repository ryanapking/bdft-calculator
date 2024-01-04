import { RootState, useAppDispatch } from '../data/store.ts';
import { useSelector } from 'react-redux';
import ProjectDirectory from './project/ProjectDirectory.tsx';
import { beginImport, setActiveProject } from '../data/displaySlice.ts';
import { Button } from 'flowbite-react';
import ButtonConfirm from './inputs/ButtonConfirm.tsx';
import { addProject, fetchSampleProject } from '../data/projectActions.ts';

function SideBar() {
  const activeProjectId = useSelector((state: RootState) => state.display.activeProject);
  const activeProject = useSelector((state: RootState) => activeProjectId ? state.projects.entities[activeProjectId] : null);
  const projectList = useSelector((state: RootState) => state.projects.ids);
  const projectEntities = useSelector((state: RootState) => state.projects.entities);
  const dispatch = useAppDispatch();

  if (activeProject) return (
    <div className='p-5'>
      <ProjectDirectory projectId={activeProjectId} />
    </div>
  );

  return (
    <div className='p-5 flex flex-col gap-6'>
      <div>
        <h2 className='text-xl font-semibold mb-4 border-b-2'>Load a Project</h2>
        {projectList.map(projectId => (
          <div
            key={projectId}
            className='hover:underline hover:cursor-pointer mb-3'
            onClick={() => dispatch(setActiveProject(projectId))}
          >
            {projectEntities[projectId].title}
          </div>
        ))}
      </div>
      <Button color='blue' onClick={() => dispatch(addProject())}>Create New Project</Button>
      <Button color='success' onClick={() => dispatch(beginImport())}>Import Project</Button>
      <ButtonConfirm buttonText='Load Sample Project' onConfirm={() => dispatch(fetchSampleProject())}>
        Are you sure you want to load the sample project?
      </ButtonConfirm>
    </div>
  )
}

export default SideBar;