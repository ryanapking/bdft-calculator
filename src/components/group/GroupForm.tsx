import { useSelector } from "react-redux";
import { useState } from 'react';
import { RootState } from "../../data/store.ts";
import { useAppDispatch } from "../../data/store.ts";
import { Button, Label, TextInput } from 'flowbite-react';
import { addGroup, deleteGroup } from "../../data/thunkActions.ts";
import { addPart } from '../../data/partActions.ts';
import { Group, update as updateGroup } from '../../data/groupsSlice.ts';
import QuantityInput from '../inputs/QuantityInput.tsx';
import useDelayedSave from '../../effects/useDelayedSave.ts';
import ButtonConfirm from '../inputs/ButtonConfirm.tsx';

function GroupForm(props:{groupId: string, parentId: string}) {
  const { groupId, parentId } = props;
  const group = useSelector((state: RootState) => state.groups.all[groupId]);
  const activeProject = useSelector((state: RootState) => state.display.activeProject);
  const isMainGroup = parentId === activeProject;
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
        <Label htmlFor='title' value='Group Title'/>
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
        {isMainGroup ? null :
          <ButtonConfirm onConfirm={() => dispatch(deleteGroup(parentId, groupId))} buttonText='Delete Group' color='failure'>
            Are you sure you want to delete this group? All its parts and subgroups will also be deleted.
          </ButtonConfirm>
        }
      </form>
      {savePending ? <p>save pending ...</p> : null}

    </div>
  )
}

export default GroupForm;