import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../data/store.ts';
import { Dropdown } from 'flowbite-react';
import { addMaterialToProject, deleteProject } from '../data/thunkActions.ts';

function ProjectDetails(props: {projectId: string}) {
  const { projectId } = props;
  const project = useSelector((state: RootState) => state.projects.all[projectId]);
  const dispatch = useAppDispatch();

  if (!project) return null;

  return (
    <div>
      <Dropdown inline label={`${project.title} : ${projectId}`}>
        <Dropdown.Item onClick={() => dispatch(addMaterialToProject(projectId))}>Add Material</Dropdown.Item>
        <Dropdown.Item onClick={() => dispatch(deleteProject(projectId))}>Delete</Dropdown.Item>
      </Dropdown>
    </div>
  )
}

export default ProjectDetails;