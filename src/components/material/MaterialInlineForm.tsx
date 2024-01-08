import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../data/store.ts';
import InlineInput from '../inputs/InlineInput.tsx';
import { saveMaterialUpdates } from '../../data/materialActions.ts';
import { PiPercent } from 'react-icons/pi';
import { BDFT, getMaterialTypeFromId, MATERIALS_TYPES, THICKNESSES } from '../../data/dataTypes.ts';
import { Radio } from 'flowbite-react';
import { setDefaultMaterial } from '../../data/projectActions.ts';
import Select from '../inputs/Select.tsx';
import { MaterialPartial } from '../../data/materialsSlice.ts';

function MaterialInlineForm(props: { materialId: string, projectId: string }) {
  const { materialId, projectId } = props;
  const material = useSelector((state: RootState) => state.materials.entities[materialId]);
  const project = useSelector((state: RootState) => state.projects.entities[projectId]);
  const dispatch = useAppDispatch();

  const materialType = getMaterialTypeFromId(material.type);

  function save(changes: MaterialPartial) {
    dispatch(saveMaterialUpdates(materialId, changes))
  }

  return (
    <div className='grid grid-cols-12 gap-3 items-center'>
      <InlineInput
        id='title'
        outerClass='col-span-3'
        stringVal={material.title}
        saveString={title => save({ title })}
      />
      <Select
        id="materialType"
        color='transparent'
        className='col-span-2 bg-transparent'
        required
        value={material.type}
        onChange={e => save({ type: e.target.value })}
      >
        {MATERIALS_TYPES.map(type => <option key={type.id} value={type.id}>{type.label}</option>)}
      </Select>
      <Select
        id="thickness"
        color='transparent'
        className={materialType !== BDFT ? 'invisible col-span-2' : 'col-span-2'}
        required
        value={material.thickness}
        onChange={e => save({ thickness: +e.target.value})}
      >
        {THICKNESSES.map(thickness => (
          <option key={thickness.value} value={thickness.value}>{thickness.label}</option>)
        )}
      </Select>
      <InlineInput
        id='waste'
        type='quantity'
        icon={PiPercent}
        outerClass='col-span-2'
        numberVal={material.waste}
        saveNumber={waste => save({ waste })}
      />
      <InlineInput
        id='cost'
        type='currency'
        outerClass='col-span-2'
        numberVal={material.cost}
        saveNumber={cost => save({ cost })}
      />
      <div className='text-center'>
        <Radio
          checked={materialId === project.defaultMaterial}
          onChange={() => dispatch(setDefaultMaterial(projectId, materialId))}
        />
      </div>
    </div>
  );
}

export default MaterialInlineForm;