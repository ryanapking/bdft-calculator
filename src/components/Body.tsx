import { useSelector } from 'react-redux';
import { RootState } from '../data/store.ts';
import { PROJECT, GROUP, PART, MATERIAL, getDataTypeFromId } from '../data/dataTypes.ts';
import GroupForm from './group/GroupForm.tsx';
import PartForm from './part/PartForm.tsx';
import MaterialForm from './material/MaterialForm.tsx';
import ProjectDetails from './project/ProjectDetails.tsx';
import { ReactElement } from 'react';

function Body() {
  const activeDetails = useSelector((state: RootState) => state.display.activeDetails);
  const projectIds = useSelector((state: RootState) => state.projects.ids);
  const groupIds = useSelector((state: RootState) => state.groups.ids);
  const materialIds = useSelector((state: RootState) => state.materials.ids);
  const partIds = useSelector((state: RootState) => state.parts.ids);

  function printBody(bodyContent?: ReactElement) {
    return (
      <div className='w-full'>
        {bodyContent}
      </div>
    )
  }

  if (!activeDetails.id) return printBody();

  switch (getDataTypeFromId(activeDetails.id)) {
    case PROJECT:
      if (!projectIds.includes(activeDetails.id)) return null;
      return printBody(<ProjectDetails key={activeDetails.id} projectId={activeDetails.id} />);
    case GROUP:
      if (!groupIds.includes(activeDetails.id)) return null;
      return printBody(<GroupForm key={activeDetails.id} groupId={activeDetails.id} parentId={activeDetails.parentId} />);
    case PART:
      if (!partIds.includes(activeDetails.id)) return null;
      return printBody(<PartForm key={activeDetails.id} partId={activeDetails.id} parentId={activeDetails.parentId} />);
    case MATERIAL:
      if (!materialIds.includes(activeDetails.id)) return null;
      return printBody(<MaterialForm key={activeDetails.id} materialId={activeDetails.id} parentId={activeDetails.parentId}/>);
    default: return printBody();
  }
}

export default Body;