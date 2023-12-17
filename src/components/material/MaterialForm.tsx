import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../data/store.ts';
import { Label, TextInput, Select } from 'flowbite-react';
import { Material, THICKNESSES, update as updateMaterial } from '../../data/materialsSlice.ts';
import { MATERIALS_TYPES } from '../../data/dataTypes.ts';
import useDelayedSave from '../../effects/useDelayedSave.ts';
import CurrencyInput from '../inputs/CurrencyInput.tsx';

function MaterialForm(props:{materialId: string, parentId: string}) {
  const { materialId } = props;
  const material = useSelector((state: RootState) => state.materials.all[materialId]);
  const dispatch = useAppDispatch();

  const [ titleInput, setTitleInput ] = useState<string>(material.title);
  const [ materialType, setMaterialType ] = useState<string>(material.type);
  const [ cost, setCost ] = useState<number>(material.cost);
  const [ thicknessInput, setThicknessInput ] = useState<number>(material.thickness);

  function save() {
    const material: Material = {
      title: titleInput,
      type: materialType,
      cost,
      thickness: +thicknessInput,
    };

    console.log('saving material: ', material);
    dispatch(updateMaterial({ materialId, material }));
  }

  const delayedSavePending = useDelayedSave([titleInput, cost, materialType, thicknessInput], save, 1000);

  if (!material) return null;

  return (
    <div className='m-2'>
      <h4>{material.title}</h4>
      <br />
      <form>
        <Label htmlFor='title'  value='Material Title' />
        <TextInput id='title' value={titleInput} onChange={(event) => setTitleInput(event.target.value)}/>
        <br />
        <Label htmlFor='cost'  value='Cost' />
        <CurrencyInput id='cost' onValueChange={value => setCost(value)} value={cost} />
        <br />
        <Label htmlFor="thickness" value="Stock Thickness" />
        <Select id="thickness" required value={thicknessInput} onChange={(event) => setThicknessInput(+event.target.value)}>
          {THICKNESSES.map(thickness => <option key={thickness.value} value={thickness.value}>{thickness.label}</option>)}
        </Select>
        <br />
        <Label htmlFor="materialType" value="Material Type" />
        <Select id="materialType" required value={materialType} onChange={(event) => setMaterialType(event.target.value)}>
          {MATERIALS_TYPES.map(type => <option key={type.id} value={type.id}>{type.label}</option>)}
        </Select>
      </form>
      {delayedSavePending ? <p>save pending ...</p> : null}
    </div>
  )
}

export default MaterialForm;