import { RootState } from '../../data/store.ts';
import { useSelector } from 'react-redux';
import GroupDirectory from '../group/GroupDirectory.tsx';
import ProjectSummary from './ProjectSummary.tsx';
import MaterialsDirectory from '../material/MaterialsDirectory.tsx';

function ProjectDirectory() {
  const activeProjectId = useSelector((state: RootState) => state.display.activeProject);
  const activeProject = useSelector((state: RootState) => activeProjectId ? state.projects.all[activeProjectId] : null);

  if (!activeProject || !activeProjectId) return null;

  return (
    <div className='pr-20'>
      <ProjectSummary projectId={activeProjectId} />
      <MaterialsDirectory materials={activeProject.materials} projectId={activeProjectId}/>
      <GroupDirectory groupId={activeProject.mainGroup} parentId={activeProjectId}/>
    </div>
  );
}

export default ProjectDirectory;