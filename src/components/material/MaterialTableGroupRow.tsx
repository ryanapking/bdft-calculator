import { getDataTypeFromId, GROUP } from '../../data/dataTypes.ts';
import { useSelector } from 'react-redux';
import { RootState } from '../../data/store.ts';
import MaterialTablePartRow from './MaterialTablePartRow.tsx';

type Props = {
  groupId: string,
  materialId: string,
  multiplier: number,
  altBorder: string,
}
function MaterialTableGroupRow(props: Props) {
  const {
    groupId,
    materialId ,
    altBorder,
    multiplier = 1,
  } = props;
  const group = useSelector((state: RootState) => state.groups.entities[groupId]);
  const allParts = useSelector((state: RootState) => state.parts.entities);

  return (
    <>
      {group.children.map((childId) => {
        if (getDataTypeFromId(childId) === GROUP) {
          return (
            <MaterialTableGroupRow
              key={childId}
              groupId={childId}
              materialId={materialId}
              multiplier={group.qty * multiplier}
              altBorder={altBorder}
            />
          );
        }
        else {
          const part = allParts[childId];
          const usage = part.calc.entities[part.calc.ids[0]]
          if (usage.id !== materialId) return null;

          return (
            <MaterialTablePartRow
              key={childId}
              partId={childId}
              altBorder={altBorder}
              multiplier={group.qty * multiplier}
            />
          );
        }
      })}
    </>
  );
}

export default MaterialTableGroupRow;