import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../data/store.ts';
import { useState } from 'react';
import { Label, TextInput, Select } from 'flowbite-react';
import useDelayedSave from '../effects/useDelayedSave.ts';
import { Material, update as updateMaterial } from '../data/materialsSlice.ts';
import { MATERIALS_TYPES } from '../data/dataTypes.ts';
import CurrencyInput from './CurrencyInput.tsx';

function MaterialDetails(props:{materialId: string, parentId: string}) {
  const { materialId } = props;
  const material = useSelector((state: RootState) => state.materials.all[materialId]);
  const dispatch = useAppDispatch();

  const [ titleInput, setTitleInput ] = useState<string>(material.title);
  const [ materialType, setMaterialType ] = useState<string>(material.type);
  const [ cost, setCost ] = useState<number>(material.cost);

  function save() {
    const material: Material = {
      title: titleInput,
      type: materialType,
      cost,
    };

    console.log('saving material: ', material);
    dispatch(updateMaterial({ materialId, material }));
  }

  const delayedSavePending = useDelayedSave([titleInput, cost, materialType], save, 1000);

  if (!material) return null;

  return (
    <div className='m-2'>
      <h4>{material.title}</h4>
      <br />
      <form>
        <Label htmlFor='title'  value='Material Title' />
        <TextInput id='title' value={titleInput} onChange={(event) => setTitleInput(event.target.value)}/>
        <Label htmlFor='cost'  value='Cost' />
        <CurrencyInput id='cost' onValueChange={value => setCost(value)} value={cost} />
        <Label htmlFor="materialType" value="Material Type" />
        <Select id="materialType" required value={materialType} onChange={(event) => setMaterialType(event.target.value)}>
          {MATERIALS_TYPES.map(type => <option key={type.id} value={type.id}>{type.label}</option>)}
        </Select>
      </form>
      {delayedSavePending ? <p>save pending ...</p> : null}
    </div>
  )
}

export default MaterialDetails;