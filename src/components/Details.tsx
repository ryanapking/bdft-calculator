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
    case PROJECT: return <ProjectDetails key={activeDetails.id} projectId={activeDetails.id} />;
    case GROUP: return <GroupDetails key={activeDetails.id} groupId={activeDetails.id} parentId={activeDetails.parentId} />;
    case PART: return <PartDetails key={activeDetails.id} partId={activeDetails.id} parentId={activeDetails.parentId} />;
    case MATERIAL: return <MaterialDetails key={activeDetails.id} materialId={activeDetails.id} parentId={activeDetails.parentId}/>;
    default: return null;
  }
}

export default Details;