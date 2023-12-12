import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../data/store.ts';
import { setActiveDetails } from '../../data/displaySlice.ts';
import { Dropdown } from 'flowbite-react';

function ProjectSummary(props: { projectId: string }) {
  const { projectId } = props;
  const project = useSelector((state: RootState) => state.projects.all[projectId]);

  const dispatch = useAppDispatch();

  if (!project) return null;

  return (
    <div>
      <Dropdown inline label={project.title ? project.title : 'Unnamed Project'}>
        <Dropdown.Item onClick={() => dispatch(setActiveDetails({id: projectId, parentId: ''}))}>View Details</Dropdown.Item>
      </Dropdown>
    </div>
  )
}

export default ProjectSummary;