import { FormEvent, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../data/store.ts';
import { Label, Textarea, Button } from 'flowbite-react';
import Select from '../inputs/Select.tsx';
import { saveMaterialUpdates } from '../../data/materialActions.ts';
import { getMaterialTypeFromId, THICKNESSES } from '../../data/dataTypes.ts';
import { MATERIALS_TYPES } from '../../data/dataTypes.ts';
import CurrencyInput from '../inputs/CurrencyInput.tsx';
import QuantityInput from '../inputs/QuantityInput.tsx';
import TextInput from '../inputs/TextInput.tsx';

function MaterialForm(props: { materialId: string }) {
  const { materialId } = props;
  const material = useSelector((state: RootState) => state.materials.entities[materialId]);
  const dispatch = useAppDispatch();

  const [ titleInput, setTitleInput ] = useState<string>(material.title);
  const [ materialTypeInput, setMaterialTypeInput ] = useState<string>(material.type);
  const [ cost, setCost ] = useState<number>(material.cost);
  const [ thicknessInput, setThicknessInput ] = useState<number>(material.thickness);
  const [ waste, setWaste ] = useState<number>(material.waste);
  const [ notesInput, setNotesInput ] = useState<string>(material.notes);

  const materialType = getMaterialTypeFromId(materialTypeInput);

  function save(e: FormEvent) {
    e.preventDefault();
    dispatch(saveMaterialUpdates(materialId, {
      title: titleInput,
      type: materialTypeInput,
      cost,
      thickness: +thicknessInput,
      waste,
      notes: notesInput,
    }));
  }

  const savePending = useMemo(() => {
    return (
      titleInput !== material.title
      || materialTypeInput !== material.type
      || cost !== material.cost
      || thicknessInput !== material.thickness
      || waste !== material.waste
      || notesInput !== material.notes
    );
  }, [material, titleInput, cost, materialTypeInput, thicknessInput, waste, notesInput])

  const classes = {
    form: 'mt-5 mb-10',
    inputGroup: 'max-w-md my-1 w-full',
    submitButton: 'my-5',
  };

  return (
    <form className={classes.form} onSubmit={save}>
      <div className={classes.inputGroup}>
        <Label htmlFor='title' value='Material Title'/>
        <TextInput id='title' autoFocus value={titleInput} onChange={e => setTitleInput(e.target.value)}/>
      </div>
      <div className={classes.inputGroup}>
        <Label htmlFor="materialType" value="Material Type"/>
        <Select id="materialType" label={materialType.label} required value={materialTypeInput} onChange={e => setMaterialTypeInput(e.target.value)}>
          {MATERIALS_TYPES.map(type => <option key={type.id} value={type.id}>{type.label}</option>)}
        </Select>
      </div>
      {materialTypeInput === 'bdft' ?
        <div className={classes.inputGroup}>
          <Label htmlFor="thickness" value="Stock Thickness"/>
          <Select
            id="thickness"
            label={THICKNESSES.find(x => x.value === thicknessInput)?.label ?? thicknessInput.toString()}
            required
            value={thicknessInput}
            onChange={e => setThicknessInput(+e.target.value)}
          >
            {THICKNESSES.map(thickness => (
              <option key={thickness.value} value={thickness.value}>{thickness.label}</option>)
            )}
          </Select>
        </div>
        : null
      }
      <div className={classes.inputGroup}>
        <Label htmlFor='cost' value='Cost'/>
        <CurrencyInput id='cost' onValueChange={value => setCost(value)} value={cost}/>
      </div>
      <div className={classes.inputGroup}>
        <Label htmlFor='waste' value='Waste Factor'/>
        <QuantityInput id='waste' suffix='%' value={waste} onValueChange={waste => setWaste(waste)}/>
      </div>
      <div className={classes.inputGroup}>
        <Label htmlFor='notes' value='Notes'/>
        <Textarea id='notes' rows={4} value={notesInput} onChange={e => setNotesInput(e.target.value)}/>
      </div>
      {savePending ? <Button type='submit' className={classes.submitButton} color='blue'>Save Changes</Button> : null}
    </form>
  )
}

export default MaterialForm;