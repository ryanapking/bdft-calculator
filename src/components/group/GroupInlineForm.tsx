import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../data/store.ts';
import InlineInput from '../inputs/InlineInput.tsx';
import { addGroup, saveGroupUpdates as save } from '../../data/groupActions.ts';
import { Button } from 'flowbite-react';
import { addPart } from '../../data/partActions.ts';

type Props = {
  groupId: string,
  focusChild: () => void,
  autoFocus?: boolean,
}
function GroupInlineForm(props: Props) {
  const { groupId, focusChild, autoFocus = false } = props;
  const group = useSelector((state: RootState) => state.groups.entities[groupId]);
  const dispatch = useAppDispatch();

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
        saveString={(value) => save(groupId, {title: value})}
        autoFocus={autoFocus}
      />
      <div className='w-full flex gap-3 justify-end'>
        <InlineInput
          id='qty'
          label='qty'
          type='quantity'
          numberVal={group.qty}
          className='w-[75px]'
          saveNumber={(quantity) => save(groupId, {qty: quantity})}
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