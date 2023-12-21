import { useSelector } from 'react-redux';
import { RootState } from '../../data/store.ts';
import MaterialTableGroupRow from './MaterialTableGroupRow.tsx';
import { getMaterialTypeFromId } from '../../data/dataTypes.ts';

function MaterialTable(props: {materialId: string, isDefaultMaterial: boolean}) {
  const { materialId, isDefaultMaterial = false} = props;
  const project = useSelector((state: RootState) => state.projects.entities[state.display.activeProject]);
  const material = useSelector((state: RootState) => state.materials.entities[materialId]);
  const materialType = getMaterialTypeFromId(material.type);

  return (
    <div className='font-mono'>
      <div className='grid grid-cols-12'>
        <div className='col-start-7'>Dimensions</div>
        <div className='col-start-8 text-right'>{materialType.shorthand}</div>
        <div className='col-start-9 text-right'>Qty</div>
      </div>
      <MaterialTableGroupRow
        materialId={materialId}
        groupId={project.mainGroup}
        isDefaultMaterial={isDefaultMaterial}
        startingColorIndex={0}
        multiplier={1}
      />
    </div>
  );
}

export default MaterialTable;