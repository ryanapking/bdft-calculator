import { RxComponent1, RxComponentInstance, RxPlus } from 'react-icons/rx';
import { useAppDispatch } from '../../data/store.ts';
import { addGroup } from '../../data/groupActions.ts';
import { addPart } from '../../data/partActions.ts';

function GroupActionIcons(props: { groupId: string }) {
  const { groupId } = props;
  const dispatch = useAppDispatch();

  return (
    <div className='flex gap-3 px-1 text-sm'>
      <button
        title='add component group'
        className='flex items-center gap1 hover:cursor-pointer hover:bg-gray-200'
        onClick={() => dispatch(addGroup(groupId, true, false))}
      >
        <RxPlus/>
        <RxComponent1/>
      </button>
      <button
        title='add component'
        className='flex items-center gap1 hover:cursor-pointer hover:bg-gray-200'
        onClick={() => dispatch(addPart(groupId, true, false))}
      >
        <RxPlus/>
        <RxComponentInstance/>
      </button>
    </div>
  );
}

export default GroupActionIcons;