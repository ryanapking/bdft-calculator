import { RootState } from '../data/store.ts';
import { useSelector } from 'react-redux';
import ProjectDirectory from './project/ProjectDirectory.tsx';

function SideBar() {
  const activeProjectId = useSelector((state: RootState) => state.display.activeProject);
  const activeProject = useSelector((state: RootState) => activeProjectId ? state.projects.entities[activeProjectId] : null);

  if (!activeProject || !activeProjectId) return null;

  return (
    <div className='p-5'>
      <ProjectDirectory projectId={activeProjectId} />
    </div>
  );
}

export default SideBar;