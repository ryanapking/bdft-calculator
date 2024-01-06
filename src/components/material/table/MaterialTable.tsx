import { useSelector } from 'react-redux';
import { RootState } from '../../../data/store.ts';
import MaterialTableGroupRow from './MaterialTableGroupRow.tsx';
import { getMaterialTypeFromId, LFT, MISC } from '../../../data/dataTypes.ts';
import DecimalAligned from './DecimalAligned.tsx';
import { calculateMaterialWaste } from '../../../data/materialActions.ts';

function MaterialTable(props: {materialId: string, altBorder: string}) {
  const { materialId, altBorder} = props;
  const project = useSelector((state: RootState) => state.projects.entities[state.display.activeProject]);
  const mainGroup = useSelector( (state: RootState) => state.groups.entities[project.mainGroup]);
  const material = useSelector((state: RootState) => state.materials.entities[materialId]);

  const materialType = getMaterialTypeFromId(material.type);
  const isMisc = materialType === MISC;
  const usageSummary = mainGroup.calc.entities?.[materialId];
  if (!usageSummary) return <div className='font-mono pl-3 pt-3'>none</div>;
  const { waste, totalAmt } = calculateMaterialWaste(usageSummary, material);

  let columnTitles = ['', 'Length', 'Width', materialType.label, 'Qty'];
  if (materialType === LFT) columnTitles[2] = '';
  else if (materialType === MISC) columnTitles = ['', '', '', 'Cost', 'Qty'];

  return (
    <div className='font-mono'>
      <div className='grid grid-cols-12 items-end'>
        <div className='col-span-4'>{columnTitles[0]}</div>
        <div className='col-span-2 text-center'>{columnTitles[1]}</div>
        <div className='col-span-2 text-center'>{columnTitles[2]}</div>
        <div className='col-span-2 text-center'>{columnTitles[3]}</div>
        <div className='col-span-2 text-right pr-3'>{columnTitles[4]}</div>
      </div>
      <MaterialTableGroupRow
        materialId={materialId}
        groupId={project.mainGroup}
        multiplier={1}
        altBorder={altBorder}
        materialType={materialType}
      />
      <div className='grid grid-cols-12 items-center'>
        <div className='col-start-9 col-span-2 border-t-2 border-gray-500'>
          <DecimalAligned num={isMisc ? usageSummary.cost : usageSummary.amt} currency={isMisc} />
        </div>
        {waste ?
          <>
            <div className='col-start-8 text-right'>+</div>
            <div className={`col-start-9 col-span-2 mt`}>
              <DecimalAligned num={waste}/>
            </div>
            <div className='text-xs'>waste</div>
            <div className='col-start-9 col-span-2 border-t-2 border-gray-500'>
              <DecimalAligned num={totalAmt}/>
            </div>
          </>
          : null
        }
      </div>
    </div>
  );
}

export default MaterialTable;