import { useSelector } from "react-redux";
import { useState } from 'react';
import { RootState } from "../../data/store.ts";
import { useAppDispatch } from "../../data/store.ts";
import { Button, Label, Spinner, TextInput } from 'flowbite-react';
import { addGroup } from "../../data/groupActions.ts";
import { addPart } from '../../data/partActions.ts';
import { saveGroupUpdates } from '../../data/groupActions.ts';
import QuantityInput from '../inputs/QuantityInput.tsx';
import useDelayedSave from '../../effects/useDelayedSave.ts';

function GroupForm(props:{groupId: string, parentId: string}) {
  const { groupId} = props;
  const group = useSelector((state: RootState) => state.groups.entities[groupId]);
  const dispatch = useAppDispatch();

  const [ titleInput, setTitleInput ] = useState<string>(group.title);
  const [ quantityInput, setQuantityInput ] = useState<number>(group.qty);

  function saveGroup() {
    dispatch(saveGroupUpdates({
      id: groupId,
      changes: {
        title: titleInput,
        qty: quantityInput,
      }
    }));
  }

  const savePending = useDelayedSave([titleInput, quantityInput], saveGroup, 500);

  if (!group) return null;

  const classes = {
    form: 'my-5',
    inputGroup: 'max-w-md my-1 w-full',
  };

  return (
    <div className="m-2">
      <form className={classes.form} onSubmit={e => e.preventDefault()}>
        <div className={classes.inputGroup}>
          <Label htmlFor='title' value='Group Title'/>
          <TextInput id='title' value={titleInput} onChange={event => setTitleInput(event.target.value)}/>
        </div>
        <div className={classes.inputGroup}>
          <Label htmlFor='quantity' value='Quantity'/>
          <QuantityInput id='quantity' value={quantityInput} onValueChange={quantity => setQuantityInput(quantity)}/>
        </div>
        {savePending ? <p>Save pending...</p> : null}
        <Button onClick={() => dispatch(addPart(groupId))}>Add Part</Button>
        <br/>
        <Button onClick={() => dispatch(addGroup(groupId))}>Add Subgroup</Button>
        <br/>
      </form>
      {savePending ? <Spinner/> : null}
    </div>
  )
}

export default GroupForm;