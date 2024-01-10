import Select from './Select.tsx';
import { useSelector } from 'react-redux';
import { RootState } from '../../data/store.ts';
import { ComponentProps } from 'react';

type Props = Omit<ComponentProps<typeof Select>, 'value' | 'label'> & {
  materialIds: Array<string>,
  value: string,
  onValueChange: (materialId:string) => void,
  includeEmptyOption?: boolean,
  emptyOptionLabel?: string,
  miscId?: string,
}

function MaterialsSelector(props: Props) {
  const {
    value,
    materialIds,
    onValueChange,
    includeEmptyOption = false,
    emptyOptionLabel = '',
    miscId = '',
    ...remainingProps
  } = props;

  const materials = useSelector((state: RootState) => state.materials.entities);

  return (
    <Select
      {...remainingProps}
      value={value}
      label={value ? materials[value].title : emptyOptionLabel}
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
      {miscId ?
        <option value={ miscId }>
          { materials[miscId].title }
        </option>
        : null
      }
    </Select>
  );
}

export default MaterialsSelector;