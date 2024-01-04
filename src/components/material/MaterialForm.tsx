import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../data/store.ts';
import { Label, TextInput, Select, Dropdown, Spinner, Textarea } from 'flowbite-react';
import { saveMaterialUpdates } from '../../data/materialActions.ts';
import { MATERIAL, THICKNESSES } from '../../data/dataTypes.ts';
import { MATERIALS_TYPES } from '../../data/dataTypes.ts';
import useDelayedSave from '../../effects/useDelayedSave.ts';
import CurrencyInput from '../inputs/CurrencyInput.tsx';
import { setAlert, setPendingDelete } from '../../data/displaySlice.ts';
import { deleteAlerts } from '../../data/messages.ts';
import QuantityInput from '../inputs/QuantityInput.tsx';
import { PiPercent } from 'react-icons/pi';

function MaterialForm(props:{materialId: string, parentId: string}) {
  const { materialId, parentId } = props;
  const material = useSelector((state: RootState) => state.materials.entities[materialId]);
  const project = useSelector((state: RootState) => state.projects.entities[parentId]);
  const isDefaultMaterial = materialId === project.defaultMaterial;
  const dispatch = useAppDispatch();

  const [ titleInput, setTitleInput ] = useState<string>(material.title);
  const [ materialType, setMaterialType ] = useState<string>(material.type);
  const [ cost, setCost ] = useState<number>(material.cost);
  const [ thicknessInput, setThicknessInput ] = useState<number>(material.thickness);
  const [ waste, setWaste ] = useState<number>(material.waste);
  const [ notesInput, setNotesInput ] = useState<string>(material.notes);

  function save() {
    dispatch(saveMaterialUpdates({
      id: materialId,
      changes: {
        title: titleInput,
        type: materialType,
        cost,
        thickness: +thicknessInput,
        waste,
        notes: notesInput,
      }
    }));
  }

  const delayedSavePending = useDelayedSave([titleInput, cost, materialType, thicknessInput, waste, notesInput], save, 500);

  function attemptDelete() {
    if (isDefaultMaterial) {
      dispatch(setAlert(deleteAlerts[MATERIAL.idPrefix]));
    } else {
      dispatch(setPendingDelete({id: materialId, parentId: project.id}));
    }
  }

  const classes = {
    form: 'my-5',
    inputGroup: 'max-w-md my-1 w-full',
  };

  return (
    <div>
      <Dropdown inline label={<h1 className='text-3xl'>{material.title}</h1>}>
        <Dropdown.Item onClick={() => attemptDelete()}>Delete Material</Dropdown.Item>
      </Dropdown>
      <form className={classes.form} onSubmit={e => e.preventDefault()}>
        <div className={classes.inputGroup}>
          <Label htmlFor='title' value='Material Title'/>
          <TextInput id='title' value={titleInput} onChange={e => setTitleInput(e.target.value)}/>
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
      </form>
      {delayedSavePending ? <Spinner/> : null}
    </div>
  )
}

export default MaterialForm;