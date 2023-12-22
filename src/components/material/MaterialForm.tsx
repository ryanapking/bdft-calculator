import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../data/store.ts';
import { Label, TextInput, Select } from 'flowbite-react';
import { saveMaterialUpdates } from '../../data/materialActions.ts';
import { THICKNESSES } from '../../data/dataTypes.ts';
import { MATERIALS_TYPES } from '../../data/dataTypes.ts';
import useDelayedSave from '../../effects/useDelayedSave.ts';
import CurrencyInput from '../inputs/CurrencyInput.tsx';
import ButtonConfirm from '../inputs/ButtonConfirm.tsx';
import { removeMaterialFromProject } from '../../data/projectActions.ts';

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

  function save() {
    dispatch(saveMaterialUpdates({
      id: materialId,
      changes: {
        title: titleInput,
        type: materialType,
        cost,
        thickness: +thicknessInput,
      }
    }));
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
        <br />
        {isDefaultMaterial ?
          <ButtonConfirm color='failure' buttonText={'Delete Material'} excludeConfirm>
            The default material cannot be deleted. If you want to delete this material, set a different material as the project default.
          </ButtonConfirm>
          :
          <ButtonConfirm color='failure' buttonText={'Delete Material'} onConfirm={() => dispatch(removeMaterialFromProject(materialId, parentId))}>
            Are you sure you want to delete this material? All parts using this material will be switched to the project default material.
          </ButtonConfirm>
        }
      </form>
      {delayedSavePending ? <p>save pending ...</p> : null}
    </div>
  )
}

export default MaterialForm;