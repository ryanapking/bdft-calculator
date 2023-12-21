import { getDataTypeFromId, GROUP } from '../../data/dataTypes.ts';
import { useSelector } from 'react-redux';
import { RootState } from '../../data/store.ts';
import MaterialTablePartRow from './MaterialTablePartRow.tsx';

function MaterialTableGroupRow(props: { groupId: string, materialId: string, isDefaultMaterial: boolean}) {
  const { groupId, materialId , isDefaultMaterial = false} = props;
  const group = useSelector((state: RootState) => state.groups.entities[groupId]);

  return (
    <>
      {group.children.map(childId => {
        if (getDataTypeFromId(childId) === GROUP) {
          return <MaterialTableGroupRow key={childId} groupId={childId} materialId={materialId} isDefaultMaterial={isDefaultMaterial}/>
        }
        else return <MaterialTablePartRow key={childId} partId={childId} materialId={materialId} isDefaultMaterial={isDefaultMaterial}/>
      })}
    </>
  );
}

export default MaterialTableGroupRow;