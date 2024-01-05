import { useSelector } from 'react-redux';
import { RootState } from '../../../data/store.ts';
import MaterialTableGroupRow from './MaterialTableGroupRow.tsx';
import { getMaterialTypeFromId } from '../../../data/dataTypes.ts';

function MaterialTable(props: {materialId: string, altBorder: string}) {
  const { materialId, altBorder} = props;
  const project = useSelector((state: RootState) => state.projects.entities[state.display.activeProject]);
  const material = useSelector((state: RootState) => state.materials.entities[materialId]);
  const materialType = getMaterialTypeFromId(material.type);

  return (
    <div className='font-mono pb-6 pt-3'>
      <div className='grid grid-cols-12'>
        <div className={`col-span-4 ${altBorder}`}></div>
        <div className={`col-span-3 ${altBorder}`}>Dimensions</div>
        <div className={`col-span-3 text-right ${altBorder}`}>{materialType.shorthand}</div>
        <div className={`col-span-2 text-right pr-3 ${altBorder}`}>Qty</div>
      </div>
      <MaterialTableGroupRow
        materialId={materialId}
        groupId={project.mainGroup}
        multiplier={1}
        altBorder={altBorder}
      />
    </div>
  );
}

export default MaterialTable;