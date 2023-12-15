import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../data/store.ts';
import { setActiveDetails } from '../../data/displaySlice.ts';
import { Dropdown } from 'flowbite-react';
import MaterialSummary from '../material/MaterialSummary.tsx';

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
      <div>
        <h3>Materials</h3>
        {project.materials.map(materialId => <MaterialSummary key={materialId} materialId={materialId} />)}
      </div>
    </div>
  )
}

export default ProjectSummary;