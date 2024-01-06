import { useSelector } from 'react-redux';
import { RootState } from '../../../data/store.ts';
import MaterialTableGroupRow from './MaterialTableGroupRow.tsx';
import { getMaterialTypeFromId, LFT, MISC } from '../../../data/dataTypes.ts';

function MaterialTable(props: {materialId: string, altBorder: string}) {
  const { materialId, altBorder} = props;
  const project = useSelector((state: RootState) => state.projects.entities[state.display.activeProject]);
  const material = useSelector((state: RootState) => state.materials.entities[materialId]);
  const materialType = getMaterialTypeFromId(material.type);

  let columnTitles = ['', 'Length', 'Width', materialType.label, 'Qty'];
  if (materialType === LFT) columnTitles[2] = '';
  else if (materialType === MISC) columnTitles = ['', '', '', 'Cost', 'Qty'];

  return (
    <div className='font-mono pb-6 pt-3'>
      <div className='grid grid-cols-12 items-end'>
        <div className={`col-span-4 ${altBorder}`}>{columnTitles[0]}</div>
        <div className={`col-span-2 text-center ${altBorder}`}>{columnTitles[1]}</div>
        <div className={`col-span-2 text-center ${altBorder}`}>{columnTitles[2]}</div>
        <div className={`col-span-2 text-center ${altBorder}`}>{columnTitles[3]}</div>
        <div className={`col-span-2 text-right pr-3 ${altBorder}`}>{columnTitles[4]}</div>
      </div>
      <MaterialTableGroupRow
        materialId={materialId}
        groupId={project.mainGroup}
        multiplier={1}
        altBorder={altBorder}
        materialType={materialType}
      />
    </div>
  );
}

export default MaterialTable;