import { useSelector } from 'react-redux';
import { RootState } from '../data/store.ts';
import { PROJECT, GROUP, PART, MATERIAL, getDataTypeFromId } from '../data/dataTypes.ts';
import ProjectForm from './project/ProjectForm.tsx';
import GroupForm from './group/GroupForm.tsx';
import PartForm from './part/PartForm.tsx';
import MaterialForm from './material/MaterialForm.tsx';

function Body() {
  const activeDetails = useSelector((state: RootState) => state.display.activeDetails);
  const projectIds = useSelector((state: RootState) => state.projects.ids);
  const groupIds = useSelector((state: RootState) => state.groups.ids);
  const materialIds = useSelector((state: RootState) => state.materials.ids);
  const partIds = useSelector((state: RootState) => state.parts.ids);

  if (!activeDetails.id) return null;

  switch (getDataTypeFromId(activeDetails.id)) {
    case PROJECT:
      if (!projectIds.includes(activeDetails.id)) return null;
      return <ProjectForm key={activeDetails.id} projectId={activeDetails.id} />;
    case GROUP:
      if (!groupIds.includes(activeDetails.id)) return null;
      return <GroupForm key={activeDetails.id} groupId={activeDetails.id} parentId={activeDetails.parentId} />;
    case PART:
      if (!partIds.includes(activeDetails.id)) return null;
      return <PartForm key={activeDetails.id} partId={activeDetails.id} parentId={activeDetails.parentId} />;
    case MATERIAL:
      if (!materialIds.includes(activeDetails.id)) return null;
      return <MaterialForm key={activeDetails.id} materialId={activeDetails.id} parentId={activeDetails.parentId}/>;
    default: return null;
  }
}

export default Body;