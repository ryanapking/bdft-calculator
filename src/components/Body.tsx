import { useSelector } from 'react-redux';
import { RootState } from '../data/store.ts';
import { PROJECT, GROUP, PART, MATERIAL, getDataTypeFromId } from '../data/dataTypes.ts';
import ProjectForm from './project/ProjectForm.tsx';
import GroupForm from './group/GroupForm.tsx';
import PartForm from './part/PartForm.tsx';
import MaterialForm from './material/MaterialForm.tsx';

function Body() {
  const activeDetails = useSelector((state: RootState) => state.display.activeDetails);

  if (!activeDetails.id) return null;

  switch (getDataTypeFromId(activeDetails.id)) {
    case PROJECT: return <ProjectForm key={activeDetails.id} projectId={activeDetails.id} />;
    case GROUP: return <GroupForm key={activeDetails.id} groupId={activeDetails.id} parentId={activeDetails.parentId} />;
    case PART: return <PartForm key={activeDetails.id} partId={activeDetails.id} parentId={activeDetails.parentId} />;
    case MATERIAL: return <MaterialForm key={activeDetails.id} materialId={activeDetails.id} parentId={activeDetails.parentId}/>;
    default: return null;
  }
}

export default Body;