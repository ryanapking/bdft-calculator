import { FormEvent, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../data/store.ts';
import { Label, TextInput, Select, Textarea, Button } from 'flowbite-react';
import { saveMaterialUpdates } from '../../data/materialActions.ts';
import { THICKNESSES } from '../../data/dataTypes.ts';
import { MATERIALS_TYPES } from '../../data/dataTypes.ts';
import CurrencyInput from '../inputs/CurrencyInput.tsx';
import QuantityInput from '../inputs/QuantityInput.tsx';
import { PiPercent } from 'react-icons/pi';

function MaterialForm(props: { materialId: string }) {
  const { materialId } = props;
  const material = useSelector((state: RootState) => state.materials.entities[materialId]);
  const dispatch = useAppDispatch();

  const [ titleInput, setTitleInput ] = useState<string>(material.title);
  const [ materialType, setMaterialType ] = useState<string>(material.type);
  const [ cost, setCost ] = useState<number>(material.cost);
  const [ thicknessInput, setThicknessInput ] = useState<number>(material.thickness);
  const [ waste, setWaste ] = useState<number>(material.waste);
  const [ notesInput, setNotesInput ] = useState<string>(material.notes);

  function save(e: FormEvent) {
    e.preventDefault();
    dispatch(saveMaterialUpdates(materialId, {
      title: titleInput,
      type: materialType,
      cost,
      thickness: +thicknessInput,
      waste,
      notes: notesInput,
    }));
  }

  const savePending = useMemo(() => {
    return (
      titleInput !== material.title
      || materialType !== material.type
      || cost !== material.cost
      || thicknessInput !== material.thickness
      || waste !== material.waste
      || notesInput !== material.notes
    );
  }, [material, titleInput, cost, materialType, thicknessInput, waste, notesInput])

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
        <Select id="materialType" required value={materialType} onChange={e => setMaterialType(e.target.value)}>
          {MATERIALS_TYPES.map(type => <option key={type.id} value={type.id}>{type.label}</option>)}
        </Select>
      </div>
      {materialType === 'bdft' ?
        <div className={classes.inputGroup}>
          <Label htmlFor="thickness" value="Stock Thickness"/>
          <Select id="thickness" required value={thicknessInput} onChange={e => setThicknessInput(+e.target.value)}>
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
        <QuantityInput id='waste' value={waste} onValueChange={waste => setWaste(waste)} icon={PiPercent}/>
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