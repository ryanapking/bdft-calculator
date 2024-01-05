import { MaterialUsageSummary } from '../../../data/materialsSlice.ts';
import { useSelector } from 'react-redux';
import { RootState } from '../../../data/store.ts';
import MaterialTable from '../../material/table/MaterialTable.tsx';
import { useState } from 'react';

type Props = {
  usageSummary: MaterialUsageSummary,
  bgColor: string,
  altBorder: string,
}
function ProjectTableRow(props: Props) {
  const { usageSummary, altBorder, bgColor} = props;
  const material = useSelector((state: RootState) => state.materials.entities[usageSummary.id]);

  const [ expanded, setExpanded ] = useState(false);

  return (
    <div>
      <div className={`grid grid-cols-12 py-1 ${bgColor}`}>
        <div className='col-span-4 hover:cursor-pointer pl-3' onClick={() => setExpanded(!expanded)}>{material.title} {expanded ? '-' : '+'}</div>
        <div className='col-start-8 text-right'>${material.cost.toFixed(2)}</div>
        <div className='col-start-9 pl-3'>/ {usageSummary.type}</div>
        <div className='col-start-10 text-right'>{usageSummary.amt}</div>
        <div className='col-start-11 pl-3'>{usageSummary.type}</div>
        <div className='col-start-12 text-right pr-3'>${usageSummary.cost.toFixed(2)}</div>
        {expanded ?
          <div className='col-start-2 col-span-6'>
            <MaterialTable materialId={material.id} altBorder={altBorder} />
          </div>
          : null
        }
      </div>
    </div>

  );
}

export default ProjectTableRow;