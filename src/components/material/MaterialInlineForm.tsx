import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../data/store.ts';
import InlineInput from '../inputs/InlineInput.tsx';
import { MaterialPartial, saveMaterialPartial } from '../../data/materialActions.ts';

function MaterialInlineForm(props: { materialId: string }) {
  const { materialId } = props;
  const material = useSelector((state: RootState) => state.materials.entities[materialId])
  const dispatch = useAppDispatch();
  
  function save(fields: MaterialPartial) {
    dispatch(saveMaterialPartial(materialId, fields));
  }
  
  return (
    <div className='flex gap-3'>
      <InlineInput
        id='title'
        stringVal={material.title}
        saveString={(value) => save({title: value})}
      />
      <InlineInput
        id='cost'
        type='currency'
        numberVal={material.cost}
        saveNumber={cost => save({ cost })}
      />
    </div>
  );
}

export default MaterialInlineForm;