import { useSelector } from "react-redux";
import { FormEvent, useMemo, useState } from 'react';
import { RootState } from "../../data/store.ts";
import { useAppDispatch } from "../../data/store.ts";
import { Button, Label, Textarea } from 'flowbite-react';
import { saveGroupUpdates } from '../../data/groupActions.ts';
import QuantityInput from '../inputs/QuantityInput.tsx';

function GroupForm(props:{groupId: string, parentId: string}) {
  const { groupId} = props;
  const group = useSelector((state: RootState) => state.groups.entities[groupId]);
  const dispatch = useAppDispatch();

  const [ quantityInput, setQuantityInput ] = useState<number>(group.qty);
  const [ notesInput, setNotesInput ] = useState<string>(group.notes);

  const savePending = useMemo(() => {
    return (
      quantityInput !== group.qty
      || notesInput !== group.notes
    )
  }, [group, quantityInput, notesInput]);

  function save(e: FormEvent) {
    e.preventDefault();
    dispatch(saveGroupUpdates(groupId, {
      qty: quantityInput,
      notes: notesInput,
    }));
  }

  const classes = {
    form: 'max-w-md',
    inputGroup: 'my-3 w-full',
    submitButton: 'my-5',
  };

  return (
    <form className={classes.form} onSubmit={save}>
      <div className={classes.inputGroup}>
        <Label htmlFor='quantity' value='Quantity'/>
        <QuantityInput id='quantity' value={quantityInput} onValueChange={quantity => setQuantityInput(quantity)}/>
      </div>
      <div className={classes.inputGroup}>
        <Label htmlFor='notes' value='Notes'/>
        <Textarea id='notes' rows={4} value={notesInput} onChange={e => setNotesInput(e.target.value)}/>
      </div>
      {savePending ? <Button className={classes.submitButton} type='submit'>Save Changes</Button> : null}
    </form>
  )
}

export default GroupForm;