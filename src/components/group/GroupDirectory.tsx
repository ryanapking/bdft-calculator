import { useSelector } from 'react-redux';
import { RootState } from '../../data/store.ts';
import { getDataTypeFromId, GROUP, PART } from '../../data/dataTypes.ts';
import PartLink from '../part/PartLink.tsx';
import { useAppDispatch } from '../../data/store.ts';
import { setActiveDetails } from '../../data/displaySlice.ts';

type Props = {
  groupId: string,
  parentId: string,
  altTitle?: string
}

function GroupDirectory(props: Props) {
  const {
    groupId,
    parentId,
    altTitle = '',
  } = props;
  const group = useSelector((state: RootState) => state.groups.entities[groupId]);
  const activeDetails = useSelector((state: RootState) => state.display.activeDetails.id);
  const dispatch = useAppDispatch();

  const printChild = (childId: string) => {
    const childType = getDataTypeFromId(childId);
    switch (childType) {
      case PART: return <PartLink highlight={childId === activeDetails} key={childId} partId={childId} parentId={groupId}/>
      case GROUP: return <GroupDirectory key={childId} groupId={childId} parentId={groupId} />
    }
  }

  const highlight = groupId === activeDetails ? 'bg-gray-200' : '';

  return (
    <div className='text-sm'>
      <div className={`hover:bg-gray-100 ${highlight}`}>
        <h2
          className='hover:cursor-pointer hover:underline}'
          onClick={() => dispatch(setActiveDetails({ id: groupId, parentId }))}
        >
          {altTitle ? altTitle : group.title}
        </h2>
      </div>

      <ul className="pl-5">
        {group.children.map(childId => printChild(childId))}
      </ul>
    </div>
  )
}

export default GroupDirectory;