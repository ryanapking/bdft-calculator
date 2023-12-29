import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../data/store.ts';
import InlineInput from '../inputs/InlineInput.tsx';
import { addGroup, GroupPartial, saveGroupPartial } from '../../data/groupActions.ts';
import { Button } from 'flowbite-react';
import { addPart } from '../../data/partActions.ts';

function GroupInlineForm(props: {groupId: string}) {
  const { groupId } = props;
  const group = useSelector((state: RootState) => state.groups.entities[groupId]);
  const dispatch = useAppDispatch();

  function saveGroup(changes: GroupPartial) {
    dispatch(saveGroupPartial(groupId, changes));
  }

  return (
    <div className='w-full flex gap-12 items-center'>
      <InlineInput
        id='title'
        stringVal={group.title}
        saveString={(value) => saveGroup({title: value})}
        autoFocus
      />
      <InlineInput
        id='qty'
        label='qty'
        type='quantity'
        numberVal={group.qty}
        saveNumber={(quantity) => saveGroup({qty: quantity})}
      />
      <Button outline color='light' size='sm' onClick={() => dispatch(addPart(groupId, true, false))}>Add Part</Button>
      <Button outline color='light' size='sm' onClick={() => dispatch(addGroup(groupId, true, false))}>Add Subgroup</Button>
    </div>
  );
}

export default GroupInlineForm;