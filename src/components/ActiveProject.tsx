import { RootState, useAppDispatch } from '../data/store.ts';
import { deleteProject } from '../data/thunkActions.ts';
import { useSelector } from 'react-redux';
import Group from './Group.tsx';
import { Dropdown } from 'flowbite-react';

function ActiveProject() {
  const activeProjectId = useSelector((state: RootState) => state.display.activeProject);
  const activeProject = useSelector((state: RootState) => activeProjectId ? state.projects.all[activeProjectId] : null);
  const dispatch = useAppDispatch();

  if (!activeProject || !activeProjectId) return null;

  return (
    <>
      <Dropdown inline label={activeProject.title}>
        <Dropdown.Item onClick={() => dispatch(deleteProject(activeProjectId, activeProject.mainGroup))}>Delete</Dropdown.Item>
      </Dropdown>
      <Group groupId={activeProject.mainGroup} parentId={activeProjectId} mainGroup/>
    </>
  );
}

export default ActiveProject;