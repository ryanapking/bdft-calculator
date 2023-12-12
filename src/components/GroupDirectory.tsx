import { useSelector } from 'react-redux';
import { RootState } from '../data/store.ts';
import { getDataTypeFromId, GROUP, PART } from '../data/dataTypes.ts';
import PartLink from './PartLink.tsx';
import { useAppDispatch } from '../data/store.ts';
import { setActiveDetails } from '../data/displaySlice.ts';

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
    <div className="m-2">
      <h1 onClick={() => dispatch(setActiveDetails({id: groupId, parentId}))}>{group.title ? group.title : 'Unnamed Group'}</h1>
      <ul className="pl-6">
        {group.children.map(childId => printChild(childId))}
      </ul>
    </div>
  )
}

export default GroupDirectory;