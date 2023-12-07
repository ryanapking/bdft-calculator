import type { RootState } from '../data/store.ts';
import { useSelector } from 'react-redux';

function ActiveProject() {
  const activeProjectId = useSelector((state: RootState) => state.display.activeProject);
  const activeProject = useSelector((state: RootState) => activeProjectId ? state.projects.all[activeProjectId] : null);
  return (
    <>
      {activeProject ?
        <>
          <h4>Active Project:</h4>
          <p>{activeProjectId}</p>
          <p>{activeProject.title}</p>
        </>
      : null}
    </>
  );
}

export default ActiveProject;