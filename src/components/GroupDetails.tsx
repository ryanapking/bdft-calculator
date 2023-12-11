import { useSelector } from "react-redux";
import { RootState } from "../data/store.ts";
import { Button, Label, TextInput } from 'flowbite-react';
import { useAppDispatch } from "../data/store.ts";
import { addPart, addGroup, deleteGroup } from "../data/thunkActions.ts";
import QuantityInput from './QuantityInput.tsx';
import { useState } from 'react';
import useDelayedSave from '../effects/useDelayedSave.ts';
import { Group, update as updateGroup } from '../data/groupsSlice.ts';

function GroupDetails(props:{groupId: string, parentId: string}) {
  const { groupId, parentId } = props;
  const group = useSelector((state: RootState) => state.groups.all[groupId]);
  const dispatch = useAppDispatch();

  const [ titleInput, setTitleInput ] = useState<string>(group.title);
  const [ quantityInput, setQuantityInput ] = useState<number>(group.qty);

  function saveGroup() {
    const groupUpdates: Group = {
      title: titleInput,
      qty: quantityInput,
      children: group.children,
    }

    dispatch(updateGroup({ groupId, group: groupUpdates }))
  }

  const savePending = useDelayedSave([titleInput, quantityInput], saveGroup, 2000);

  if (!group) return null;

  return (
    <div className="m-2">
      <h4>{group.title}</h4>
      <br />
      <form>
        <Label htmlFor='title' value='Part Title'/>
        <TextInput id='title' value={titleInput} onChange={event => setTitleInput(event.target.value)}/>
        <br/>
        <Label htmlFor='quantity' value='Quantity'/>
        <QuantityInput id='quantity' value={quantityInput} onValueChange={quantity => setQuantityInput(quantity)}/>
        <br/>
        {savePending ? <p>Save pending...</p> : null}
        <Button onClick={() => dispatch(addPart(groupId))} >Add Part</Button>
        <br />
        <Button onClick={() => dispatch(addGroup(groupId))} >Add Subgroup</Button>
        <br />
        <Button color='failure' onClick={() => dispatch(deleteGroup(parentId, groupId))}>Delete Group</Button>
      </form>
      {savePending ? <p>save pending ...</p> : null}
    </div>
  )
}

export default GroupDetails;