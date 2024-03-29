import { MaterialUsageSummary } from '../../../data/materialsSlice.ts';
import { useSelector } from 'react-redux';
import { RootState } from '../../../data/store.ts';
import MaterialTable from '../../material/table/MaterialTable.tsx';
import { useState } from 'react';
import { getMaterialTypeFromId, MISC } from '../../../data/dataTypes.ts';
import { calculateMaterialWaste } from '../../../data/materialActions.ts';

type Props = {
  usageSummary: MaterialUsageSummary,
  bgColor: string,
  altBorder: string,
}
function ProjectTableRow(props: Props) {
  const { usageSummary, altBorder, bgColor} = props;
  const material = useSelector((state: RootState) => state.materials.entities[usageSummary.id]);

  const [ expanded, setExpanded ] = useState(false);

  const materialType = getMaterialTypeFromId(material.type);
  const { totalAmt, totalCost } = calculateMaterialWaste(usageSummary, material);
  const isMisc = (materialType === MISC);

  return (
    <div>
      <div className={`grid grid-cols-12 py-1 ${bgColor}`}>
        <div className='col-span-4 hover:cursor-pointer pl-3' onClick={() => setExpanded(!expanded)}>
          {material.title} {expanded ? '-' : '+'}
        </div>
        <div className='col-start-8 text-right'>{isMisc ? '' : totalAmt.toFixed(3)}</div>
        <div className='col-start-9 pl-3'>{isMisc ? '' : materialType.shorthand}</div>
        <div className='col-start-10 text-right'>{isMisc ? '' : material.cost.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}</div>
        <div className='col-start-11 pl-3'>{isMisc ? '' : '/ ' + materialType.shorthand}</div>
        <div className='col-start-12 text-right pr-3'>{totalCost.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}</div>
        {expanded ?
          <div className='col-start-2 col-span-6 pt-3 pb-6'>
            <MaterialTable materialId={material.id} altBorder={altBorder}/>
          </div>
          : null
        }
      </div>
    </div>

  );
}

export default ProjectTableRow;