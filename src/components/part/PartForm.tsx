import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../data/store.ts';
import { Dropdown, Label, Spinner, TextInput } from 'flowbite-react';
import { useAppDispatch } from '../../data/store.ts';
import { savePartUpdates } from '../../data/partActions.ts';
import useDelayedSave from '../../effects/useDelayedSave.ts';
import InchInput from '../inputs/InchInput.tsx';
import QuantityInput from '../inputs/QuantityInput.tsx';
import MaterialsSelector from '../inputs/MaterialsSelector.tsx';
import PartSummary from './PartSummary.tsx';
import { setPendingDelete } from '../../data/displaySlice.ts';

function PartForm(props: {partId: string, parentId: string}) {
  const { partId, parentId} = props;
  const part = useSelector((state: RootState) => state.parts.entities[partId]);
  const materials = useSelector((state: RootState) => state.projects.entities[state.display.activeProject].materials);
  const dispatch = useAppDispatch();

  const [ titleInput, setTitleInput ] = useState<string>(part.title);
  const [ lengthInput, setLengthInput ] = useState<number>(part.l);
  const [ widthInput, setWidthInput ] = useState<number>(part.w);
  const [ heightInput, setHeightInput ] = useState<number>(part.h);
  const [ quantityInput, setQuantityInput ] = useState<number>(part.qty);
  const [ materialInput, setMaterialInput ] = useState<string>(part.m);

  function savePart() {
    dispatch(savePartUpdates({
      id: partId,
      changes: {
        title: titleInput,
        l: lengthInput,
        w: widthInput,
        h: heightInput,
        qty: quantityInput,
        m: materialInput,
      }
    }));
  }

  const savePending = useDelayedSave([titleInput, lengthInput, widthInput, heightInput, quantityInput, materialInput], savePart, 500);

  if (!part) return null;

  return (
    <div className='m-2'>
      <Dropdown inline label={<h1 className='text-3xl'>{part.title}</h1>}>
        <Dropdown.Item onClick={() => dispatch(setPendingDelete({id: partId, parentId: parentId}))}>Delete Item</Dropdown.Item>
      </Dropdown>
      <form className='w-full' onSubmit={e => e.preventDefault()}>
        <div>
          <Label htmlFor='title' value='Part Title'/>
          <TextInput id='title' value={titleInput} onChange={event => setTitleInput(event.target.value)}/>
        </div>
        <div>
          <Label htmlFor='length' value='Length (inches)'/>
          <InchInput id='length' value={lengthInput} onValueChange={length => setLengthInput(length)}/>
        </div>
        <div>
          <Label htmlFor='width' value='Width (inches)'/>
          <InchInput id='width' value={widthInput} onValueChange={width => setWidthInput(width)}/>
        </div>
        <div>
          <Label htmlFor='height' value='Height (inches)'/>
          <InchInput id='height' value={heightInput} onValueChange={height => setHeightInput(height)}/>
        </div>
        <div>
          <Label htmlFor='quantity' value='Quantity'/>
          <QuantityInput id='quantity' value={quantityInput} onValueChange={quantity => setQuantityInput(quantity)}/>
        </div>
        <div>
          <Label htmlFor='material' value='Material' />
          <MaterialsSelector
            id='material'
            value={materialInput}
            materialIds={materials}
            includeEmptyOption
            emptyOptionLabel='Project Default'
            onValueChange={material => setMaterialInput(material)}
          />
        </div>
        {savePending ? <Spinner /> : null}
      </form>
      <PartSummary partId={partId}/>
    </div>
  )
}

export default PartForm;