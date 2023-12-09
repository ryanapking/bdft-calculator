import { RootState } from '../data/store.ts';
import { useSelector } from 'react-redux';
import GroupDirectory from './GroupDirectory.tsx';
import ProjectSummary from './ProjectSummary.tsx';
import MaterialsDirectory from './MaterialsDirectory.tsx';

function ProjectDirectory() {
  const activeProjectId = useSelector((state: RootState) => state.display.activeProject);
  const activeProject = useSelector((state: RootState) => activeProjectId ? state.projects.all[activeProjectId] : null);

  if (!activeProject || !activeProjectId) return null;

  return (
    <div>
      <ProjectSummary projectId={activeProjectId} />
      <MaterialsDirectory materials={activeProject.materials} projectId={activeProjectId}/>
      <GroupDirectory groupId={activeProject.mainGroup} parentId={activeProjectId}/>
    </div>
  );
}

export default ProjectDirectory;