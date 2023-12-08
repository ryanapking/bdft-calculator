import type { RootState } from '../data/store.ts';
import { useSelector } from 'react-redux';
import Group from './Group.tsx';

function ActiveProject() {
  const activeProjectId = useSelector((state: RootState) => state.display.activeProject);
  const activeProject = useSelector((state: RootState) => activeProjectId ? state.projects.all[activeProjectId] : null);

  if (!activeProject) return null;

  return (
    <>
      <h2 className={'font-bold'}>{ activeProject.title}</h2>
      <Group groupId={activeProject.mainGroup} />
    </>
  );
}

export default ActiveProject;