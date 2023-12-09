import { useSelector } from 'react-redux';
import { RootState } from '../data/store.ts';
import { PROJECT, GROUP, PART, MATERIAL, getDataTypeFromId } from '../data/dataTypes.ts';
import ProjectDetails from './ProjectDetails.tsx';
import GroupDetails from './GroupDetails.tsx';
import PartDetails from './PartDetails.tsx';
import MaterialDetails from './MaterialDetails.tsx';

function Details() {
  const activeDetails = useSelector((state: RootState) => state.display.activeDetails);
  if (!activeDetails.id) return null;

  switch (getDataTypeFromId(activeDetails.id)) {
    case PROJECT: return <ProjectDetails projectId={activeDetails.id} />;
    case GROUP: return <GroupDetails groupId={activeDetails.id} parentId={activeDetails.parentId} />
    case PART: return <PartDetails partId={activeDetails.id} parentId={activeDetails.parentId} />
    case MATERIAL: return <MaterialDetails materialId={activeDetails.id} parentId={activeDetails.parentId}/>
  }
  return (
    <div>
      <h1>Details component</h1>
      <p>Active: {activeDetails.id}</p>
      <p>Parent id: {activeDetails.parentId}</p>
    </div>
  )
}

export default Details;