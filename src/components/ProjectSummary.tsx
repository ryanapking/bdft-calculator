import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../data/store.ts';
import { setActiveDetails } from '../data/displaySlice.ts';

function ProjectSummary(props: { projectId: string }) {
  const { projectId } = props;
  const project = useSelector((state: RootState) => state.projects.all[projectId]);

  const dispatch = useAppDispatch();

  if (!project) return null;

  return (
    <div>
      <h1>Project title: {project.title}</h1>
      <h1>Project id: {projectId}</h1>
      <h1 onClick={() => dispatch(setActiveDetails({id: projectId, parentId: ''}))}>View Project Details</h1>
    </div>
  )
}

export default ProjectSummary;