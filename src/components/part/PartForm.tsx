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
import { getMaterialTypeFromId } from '../../data/dataTypes.ts';
import CurrencyInput from '../inputs/CurrencyInput.tsx';

function PartForm(props: {partId: string, parentId: string}) {
  const { partId, parentId} = props;
  const part = useSelector((state: RootState) => state.parts.entities[partId]);
  const project = useSelector((state: RootState) => state.projects.entities[state.display.activeProject]);
  const dispatch = useAppDispatch();

  const [ titleInput, setTitleInput ] = useState<string>(part.title);
  const [ lengthInput, setLengthInput ] = useState<number>(part.l);
  const [ widthInput, setWidthInput ] = useState<number>(part.w);
  const [ heightInput, setHeightInput ] = useState<number>(part.h);
  const [ quantityInput, setQuantityInput ] = useState<number>(part.qty);
  const [ materialInput, setMaterialInput ] = useState<string>(part.m);
  const [ costInput, setCostInput ] = useState<number>(part.c);

  const currentMaterialId = materialInput ? materialInput : project.defaultMaterial;
  const currentMaterial = useSelector((state: RootState) => state.materials.entities[currentMaterialId]);
  const materialType = getMaterialTypeFromId(currentMaterial.type);

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
        c: costInput,
      }
    }));
  }

  const savePending = useDelayedSave([titleInput, lengthInput, widthInput, heightInput, quantityInput, materialInput, costInput], savePart, 500);

  if (!part) return null;

  const classes = {
    form: 'my-5',
    inputGroup: 'max-w-md my-1 w-full',
    flexedInputGroup: 'max-w-md flex gap-3',
  };

  return (
    <div className='m-2'>
      <Dropdown inline label={<h1 className='text-3xl'>{part.title}</h1>}>
        <Dropdown.Item onClick={() => dispatch(setPendingDelete({id: partId, parentId: parentId}))}>Delete Item</Dropdown.Item>
      </Dropdown>
      <form className={classes.form} onSubmit={e => e.preventDefault()}>
        <div className={classes.inputGroup}>
          <Label htmlFor='title' value='Part Title'/>
          <TextInput id='title' value={titleInput} onChange={event => setTitleInput(event.target.value)}/>
        </div>
        <div className={classes.inputGroup}>
          <Label htmlFor='material' value='Material'/>
          <MaterialsSelector
            id='material'
            value={materialInput}
            materialIds={project.materials}
            includeEmptyOption
            miscId={project.miscMaterial}
            emptyOptionLabel='Project Default'
            onValueChange={material => setMaterialInput(material)}
          />
        </div>
        <div className={classes.flexedInputGroup}>
          {materialType.partFields.includes('l') &&
            <div className={classes.inputGroup}>
              <Label htmlFor='length' value='Length (inches)'/>
              <InchInput id='length' value={lengthInput} alignLeft onValueChange={length => setLengthInput(length)}/>
            </div>
          }
          {materialType.partFields.includes('w') &&
            <div className={classes.inputGroup}>
              <Label htmlFor='width' value='Width (inches)'/>
              <InchInput id='width' value={widthInput} alignLeft onValueChange={width => setWidthInput(width)}/>
            </div>
          }
          {materialType.partFields.includes('h') &&
            <div className={classes.inputGroup}>
              <Label htmlFor='height' value='Height (inches)'/>
              <InchInput id='height' value={heightInput} alignLeft onValueChange={height => setHeightInput(height)}/>
            </div>
          }
          {materialType.partFields.includes('c') &&
            <div className={classes.inputGroup}>
              <Label htmlFor='cost' value='Cost'/>
              <CurrencyInput id='cost' value={costInput} onValueChange={cost => setCostInput(cost)}/>
            </div>
          }
        </div>
        <div className={classes.inputGroup}>
          <Label htmlFor='quantity' value='Quantity'/>
          <QuantityInput id='quantity' value={quantityInput} onValueChange={quantity => setQuantityInput(quantity)}/>
        </div>
        {savePending ? <Spinner/> : null}
      </form>
      <PartSummary partId={partId}/>
    </div>
  )
}

export default PartForm;