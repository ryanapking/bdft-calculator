import { useSelector } from 'react-redux';
import { RootState } from '../../data/store.ts';
import { getDataTypeFromId, GROUP, PART } from '../../data/dataTypes.ts';
import { useAppDispatch } from '../../data/store.ts';
import { setActiveDetails } from '../../data/displaySlice.ts';
import { RxComponent1, RxComponentInstance } from 'react-icons/rx';

const highlightBg = 'bg-gray-200';

type PartLinkProps = {
  partId: string,
  parentId: string,
  highlight?: boolean
}

function PartLink(props: PartLinkProps) {
  const {
    partId,
    parentId,
    highlight = false
  } = props;
  const part = useSelector((state: RootState) => state.parts.entities[partId]);
  const dispatch = useAppDispatch();
  const background = highlight ? highlightBg : '';

  return (
    <button
      className={`w-full hover:cursor-pointer hover:underline flex items-center gap-2 ${background}`}
      onClick={() => dispatch(setActiveDetails({ id: partId, parentId }))}
    >
      <RxComponentInstance />
      {part.title ? part.title : '(empty title)'}
    </button>
  )
}

type GroupDirectoryProps = {
  groupId: string,
  parentId: string,
  excludeGroupTitle?: boolean
}

function GroupDirectory(props: GroupDirectoryProps) {
  const {
    groupId,
    parentId,
    excludeGroupTitle = false,
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

  const highlight = groupId === activeDetails ? highlightBg : '';

  return (
    <div className='text-sm'>
      {excludeGroupTitle ? null :
        <div className={highlight}>
          <button
            className='w-full hover:cursor-pointer hover:underline flex items-center gap-2'
            onClick={() => dispatch(setActiveDetails({ id: groupId, parentId }))}
          >
            <RxComponent1 />
            {group.title}
          </button>
        </div>
      }

      <ul className="pl-5">
        {group.children.map(childId => printChild(childId))}
      </ul>
    </div>
  )
}

export default GroupDirectory;