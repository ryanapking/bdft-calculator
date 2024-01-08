import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../data/store.ts';
import InlineInput from '../inputs/InlineInput.tsx';
import { addGroup, saveGroupUpdates } from '../../data/groupActions.ts';
import { Button } from 'flowbite-react';
import { addPart } from '../../data/partActions.ts';
import { GroupPartial } from '../../data/groupsSlice.ts';

type Props = {
  groupId: string,
  focusChild: () => void,
  autoFocus?: boolean,
}
function GroupInlineForm(props: Props) {
  const { groupId, focusChild, autoFocus = false } = props;
  const group = useSelector((state: RootState) => state.groups.entities[groupId]);
  const dispatch = useAppDispatch();

  function save(changes: GroupPartial) {
    dispatch(saveGroupUpdates(groupId, changes));
  }

  function addChildGroup() {
    focusChild();
    dispatch(addGroup(groupId, true, false))
  }

  function addChildPart() {
    focusChild();
    dispatch(addPart(groupId, true, false));
  }

  return (
    <div className='w-full flex gap-12 items-center'>
      <InlineInput
        id='title'
        stringVal={group.title}
        saveString={title => save({title})}
        autoFocus={autoFocus}
      />
      <div className='w-full flex gap-3 justify-end'>
        <InlineInput
          id='qty'
          label='qty'
          type='quantity'
          numberVal={group.qty}
          className='w-[75px]'
          saveNumber={qty => save({qty})}
        />
        <Button outline color='light' size='sm' className='w-64' onClick={addChildPart}>
          Add Component
        </Button>
        <Button outline color='light' size='sm' className='w-64' onClick={addChildGroup}>
          Add Subgroup
        </Button>
      </div>
    </div>
  );
}

export default GroupInlineForm;