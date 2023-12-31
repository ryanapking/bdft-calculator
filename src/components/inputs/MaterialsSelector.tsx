import { Select } from 'flowbite-react';
import { useSelector } from 'react-redux';
import { RootState } from '../../data/store.ts';
import { ComponentProps } from 'react';

type Props = ComponentProps<typeof Select> & {
  id: string,
  materialIds: Array<string>,
  value: string,
  onValueChange: (_:string) => void,
  includeEmptyOption?: boolean,
  emptyOptionLabel?: string,
}

function MaterialsSelector(props: Props) {
  const {
    id,
    value,
    materialIds,
    onValueChange,
    includeEmptyOption = false,
    emptyOptionLabel = '',
    ...remainingProps
  } = props;

  const materials = useSelector((state: RootState) => state.materials.entities);

  return (
    <Select
      {...remainingProps}
      id={id}
      value={value}
      onChange={(event) => onValueChange(event.target.value)}
    >
      {includeEmptyOption ?
        <option value={''}>
          {emptyOptionLabel}
        </option>
        : null
      }
      {materialIds.map(materialId =>
        <option key={materialId} value={materialId}>
        {materials[materialId].title}
        </option>
      )}
    </Select>
  );
}

export default MaterialsSelector;