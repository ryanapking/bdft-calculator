import { useSelector } from 'react-redux';
import { RootState } from '../../data/store.ts';
import { getDataTypeFromId, GROUP, PART } from '../../data/dataTypes.ts';
import PartLink from '../part/PartLink.tsx';
import { useAppDispatch } from '../../data/store.ts';
import { setActiveDetails } from '../../data/displaySlice.ts';
import { addGroup } from '../../data/groupActions.ts';
import { addPart } from '../../data/partActions.ts';
import { Dropdown } from 'flowbite-react';

type Props = {
  groupId: string,
  parentId: string,
  altTitle?: string
  mainGroup?: boolean,
}

function GroupDirectory(props: Props) {
  const {
    groupId,
    parentId,
    altTitle = '',
    mainGroup = false,
  } = props;
  const group = useSelector((state: RootState) => state.groups.entities[groupId]);
  const dispatch = useAppDispatch();

  const printChild = (childId: string) => {
    const childType = getDataTypeFromId(childId);
    switch (childType) {
      case PART: return <PartLink key={childId} partId={childId} parentId={groupId}/>
      case GROUP: return <GroupDirectory key={childId} groupId={childId} parentId={groupId} />
    }
  }

  const title = <h3 className={mainGroup ? 'text-xl' : ''}>{altTitle ? altTitle : group.title}</h3>

  return (
    <div className='text-sm'>
      <div className='hover:bg-gray-100'>
        <Dropdown inline label={title}>
          <Dropdown.Item onClick={() => dispatch(addPart(groupId))}>Add Part</Dropdown.Item>
          <Dropdown.Item onClick={() => dispatch(addGroup(groupId))}>Add Group</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item onClick={() => dispatch(setActiveDetails({ id: groupId, parentId }))}>{mainGroup ? 'Arrange Items' : 'View Details'}</Dropdown.Item>
        </Dropdown>
      </div>

      <ul className="pl-5">
        {group.children.map(childId => printChild(childId))}
      </ul>
    </div>
  )
}

export default GroupDirectory;