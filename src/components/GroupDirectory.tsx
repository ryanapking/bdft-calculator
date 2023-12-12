import { useSelector } from 'react-redux';
import { RootState } from '../data/store.ts';
import { getDataTypeFromId, GROUP, PART } from '../data/dataTypes.ts';
import PartLink from './PartLink.tsx';
import { useAppDispatch } from '../data/store.ts';
import { setActiveDetails } from '../data/displaySlice.ts';
import { addPart, addGroup } from '../data/thunkActions.ts';
import { Dropdown } from 'flowbite-react';

function GroupDirectory(props: {groupId: string, parentId: string}) {
  const { groupId, parentId } = props;
  const group = useSelector((state: RootState) => state.groups.all[groupId]);
  const dispatch = useAppDispatch();

  const printChild = (childId: string) => {
    const childType = getDataTypeFromId(childId);
    switch (childType) {
      case PART: return <PartLink key={childId} partId={childId} parentId={groupId}/>
      case GROUP: return <GroupDirectory key={childId} groupId={childId} parentId={groupId} />
    }
  }

  return (
    <div>
      <div className='hover:bg-gray-100'>
        <Dropdown inline label={group.title ? group.title : 'Unnamed Group'}>
          <Dropdown.Item onClick={() => dispatch(addPart(groupId))}>Add Part</Dropdown.Item>
          <Dropdown.Item onClick={() => dispatch(addGroup(groupId))}>Add Group</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item onClick={() => dispatch(setActiveDetails({ id: groupId, parentId }))}>View Details</Dropdown.Item>
        </Dropdown>
      </div>

      <ul className="pl-6">
        {group.children.map(childId => printChild(childId))}
      </ul>
    </div>
  )
}

export default GroupDirectory;