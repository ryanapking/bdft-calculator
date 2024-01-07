import { useSelector } from 'react-redux';
import { RootState } from '../data/store.ts';
import { PROJECT, GROUP, PART, MATERIAL, getDataTypeFromId } from '../data/dataTypes.ts';
import ProjectDetails from './project/ProjectDetails.tsx';
import { ReactElement } from 'react';
import GroupDetails from './group/GroupDetails.tsx';
import PartDetails from './part/PartDetails.tsx';
import MaterialDetails from './material/MaterialDetails.tsx';
import ProjectMaterialDetails from './project/ProjectMaterialDetails.tsx';

function Body() {
  const activeDetails = useSelector((state: RootState) => state.display.activeDetails);
  const projectIds = useSelector((state: RootState) => state.projects.ids);
  const groupIds = useSelector((state: RootState) => state.groups.ids);
  const materialIds = useSelector((state: RootState) => state.materials.ids);
  const partIds = useSelector((state: RootState) => state.parts.ids);

  function printBody(bodyContent?: ReactElement) {
    return (
      <div className='grow overflow-x-auto overflow-y-auto p-4'>
        {bodyContent}
      </div>
    )
  }

  if (!activeDetails.id) return printBody();

  if (activeDetails.id === 'materials') return printBody(<ProjectMaterialDetails />);

  switch (getDataTypeFromId(activeDetails.id)) {
    case PROJECT:
      if (!projectIds.includes(activeDetails.id)) return null;
      return printBody(<ProjectDetails key={activeDetails.id} projectId={activeDetails.id} />);
    case GROUP:
      if (!groupIds.includes(activeDetails.id)) return null;
      return printBody(<GroupDetails key={activeDetails.id} groupId={activeDetails.id} parentId={activeDetails.parentId} />);
    case PART:
      if (!partIds.includes(activeDetails.id)) return null;
      return printBody(<PartDetails key={activeDetails.id} partId={activeDetails.id} parentId={activeDetails.parentId} />);
    case MATERIAL:
      if (!materialIds.includes(activeDetails.id)) return null;
      return printBody(<MaterialDetails key={activeDetails.id} materialId={activeDetails.id} parentId={activeDetails.parentId}/>);
    default: return printBody();
  }
}

export default Body;