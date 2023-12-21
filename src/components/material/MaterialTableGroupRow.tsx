import { getDataTypeFromId, GROUP } from '../../data/dataTypes.ts';
import { useSelector } from 'react-redux';
import { RootState } from '../../data/store.ts';
import MaterialTablePartRow from './MaterialTablePartRow.tsx';

type Props = {
  groupId: string,
  materialId: string,
  isDefaultMaterial: boolean,
  startingColorIndex: number,
  multiplier: number,
}
function MaterialTableGroupRow(props: Props) {
  const {
    groupId,
    materialId ,
    isDefaultMaterial = false,
    startingColorIndex = 0,
    multiplier = 1,
  } = props;
  const group = useSelector((state: RootState) => state.groups.entities[groupId]);
  const bgColors = ['bg-gray-100', 'bg-gray-300'];

  let colorIndex = startingColorIndex;

  return (
    <>
      {group.children.map((childId) => {
        if (getDataTypeFromId(childId) === GROUP) {
          return (
            <MaterialTableGroupRow
              key={childId}
              groupId={childId}
              materialId={materialId}
              isDefaultMaterial={isDefaultMaterial}
              startingColorIndex={colorIndex}
              multiplier={group.qty * multiplier}
            />
          );
        }
        else return (
          <MaterialTablePartRow
            key={childId}
            partId={childId}
            materialId={materialId}
            isDefaultMaterial={isDefaultMaterial}
            bgColor={bgColors[colorIndex++ % 2]}
            multiplier={group.qty * multiplier}
          />
        );
      })}
    </>
  );
}

export default MaterialTableGroupRow;