import { useSelector } from 'react-redux';
import { RootState } from '../../data/store.ts';
import { Button, Label, TextInput } from 'flowbite-react';
import { deletePart } from '../../data/thunkActions.ts';
import { useAppDispatch } from '../../data/store.ts';
import { useState } from 'react';
import InchInput from '../inputs/InchInput.tsx';
import useDelayedSave from '../../effects/useDelayedSave.ts';
import { Part, update as updatePart } from '../../data/partsSlice.ts';
import QuantityInput from '../inputs/QuantityInput.tsx';

function PartDetails(props: {partId: string, parentId: string}) {
  const { partId, parentId} = props;
  const part = useSelector((state: RootState) => state.parts.all[partId]);
  const dispatch = useAppDispatch();

  const [ titleInput, setTitleInput ] = useState<string>(part.title);
  const [ lengthInput, setLengthInput ] = useState<number>(part.l);
  const [ widthInput, setWidthInput ] = useState<number>(part.w);
  const [ heightInput, setHeightInput ] = useState<number>(part.h);
  const [ quantityInput, setQuantityInput ] = useState<number>(part.qty);

  // console.log('lengthInput: ', lengthInput);

  function savePart() {
    const part: Part = {
      title: titleInput,
      l: lengthInput,
      w: widthInput,
      h: heightInput,
      qty: quantityInput,
      m: '',
    }
    dispatch(updatePart({ partId, part }));
  }

  const savePending = useDelayedSave([titleInput, lengthInput, widthInput, heightInput, quantityInput], savePart, 2000);

  if (!part) return null;

  return (
    <div className='m-2'>
      <h4>{part.title}</h4>
      <br />
      <form>
        <Label htmlFor='title' value='Part Title'/>
        <TextInput id='title' value={titleInput} onChange={event => setTitleInput(event.target.value)}/>
        <br/>
        <Label htmlFor='length' value='Length (inches)'/>
        <InchInput id='length' value={lengthInput} onValueChange={length => setLengthInput(length)}/>
        <br/>
        <Label htmlFor='width' value='Width (inches)'/>
        <InchInput id='width' value={widthInput} onValueChange={width => setWidthInput(width)}/>
        <br/>
        <Label htmlFor='height' value='Height (inches)'/>
        <InchInput id='height' value={heightInput} onValueChange={height => setHeightInput(height)}/>
        <br/>
        <Label htmlFor='quantity' value='Quantity'/>
        <QuantityInput id='quantity' value={quantityInput} onValueChange={quantity => setQuantityInput(quantity)}/>
        <br/>
        {savePending ? <p>Save pending...</p> : null}
        <Button color='failure' onClick={() => dispatch(deletePart(parentId, partId))}>Delete Part</Button>
      </form>
    </div>
  )
}

export default PartDetails;