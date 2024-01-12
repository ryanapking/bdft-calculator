import { FormEvent, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../data/store.ts';
import { Button, Label, Textarea } from 'flowbite-react';
import { useAppDispatch } from '../../data/store.ts';
import { savePartUpdates } from '../../data/partActions.ts';
import InchInput from '../inputs/InchInput.tsx';
import QuantityInput from '../inputs/QuantityInput.tsx';
import MaterialsSelector from '../inputs/MaterialsSelector.tsx';
import { getMaterialTypeFromId } from '../../data/dataTypes.ts';
import CurrencyInput from '../inputs/CurrencyInput.tsx';
import TextInput from '../inputs/TextInput.tsx';

function PartForm(props: {partId: string}) {
  const { partId} = props;
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
  const [ notesInput, setNotesInput ] = useState<string>(part.notes);

  const currentMaterialId = materialInput ? materialInput : project.defaultMaterial;
  const currentMaterial = useSelector((state: RootState) => state.materials.entities[currentMaterialId]);
  const materialType = getMaterialTypeFromId(currentMaterial.type);

  function save(e: FormEvent) {
    e.preventDefault()
    dispatch(savePartUpdates(partId, {
      title: titleInput,
      l: lengthInput,
      w: widthInput,
      h: heightInput,
      qty: quantityInput,
      m: materialInput,
      c: costInput,
      notes: notesInput,
    }));
  }

  const savePending = useMemo(() => {
    return (
      titleInput !== part.title
      || lengthInput !== part.l
      || widthInput !== part.w
      || heightInput !== part.h
      || quantityInput !== part.qty
      || materialInput !== part.m
      || costInput !== part.c
      || notesInput !== part.notes
    );
  }, [part, titleInput, lengthInput, widthInput, heightInput, quantityInput, materialInput, costInput, notesInput]);

  const classes = {
    form: 'my-5',
    inputGroup: 'max-w-md my-1 w-full',
    flexedInputGroup: 'max-w-md flex gap-3',
    submitButton: 'mt-5'
  };

  return (
    <form className={classes.form} onSubmit={save}>
      <div className={classes.inputGroup}>
        <Label htmlFor='title' value='Title'/>
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
            <Label htmlFor='length' value='Length'/>
            <InchInput id='length' value={lengthInput} onValueChange={length => setLengthInput(length)}/>
          </div>
        }
        {materialType.partFields.includes('w') &&
          <div className={classes.inputGroup}>
            <Label htmlFor='width' value='Width'/>
            <InchInput id='width' value={widthInput}  onValueChange={width => setWidthInput(width)}/>
          </div>
        }
        {materialType.partFields.includes('h') &&
          <div className={classes.inputGroup}>
            <Label htmlFor='height' value='Height'/>
            <InchInput id='height' value={heightInput} onValueChange={height => setHeightInput(height)}/>
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
      <div className={classes.inputGroup}>
        <Label htmlFor='notes' value='Notes'/>
        <Textarea id='notes' rows={4} value={notesInput} onChange={e => setNotesInput(e.target.value)}/>
      </div>
      {savePending ? <Button type='submit' color='blue' className={classes.submitButton}>Save Changes</Button> : null}
    </form>
  )
}

export default PartForm;