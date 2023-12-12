import { Select } from 'flowbite-react';
import { useSelector } from 'react-redux';
import { RootState } from '../../data/store.ts';

function MaterialsSelector(props: {id: string, materialIds: Array<string>, value: string, onValueChange: (_:string) => void}) {
  const { id, materialIds, value, onValueChange } = props;
  const materials = useSelector((state: RootState) => state.materials.all);

  return (
    <Select
      id={id}
      value={value}
      onChange={(event) => onValueChange(event.target.value)}
    >
      {materialIds.map(materialId =>
        <option key={materialId} value={materialId}>
          {materials[materialId].title}
        </option>
      )}
    </Select>
  );
}

export default MaterialsSelector;