import { MaterialUsageSummary } from '../../data/materialsSlice.ts';
import { useSelector } from 'react-redux';
import { RootState } from '../../data/store.ts';
import MaterialTable from '../material/MaterialTable.tsx';
import { useState } from 'react';

function ProjectTableRow(props: { usageSummary: MaterialUsageSummary, defaultMaterial: string, bgColor: string}) {
  const { usageSummary, defaultMaterial, bgColor} = props;
  const material = useSelector((state: RootState) => state.materials.entities[usageSummary.id]);

  const [ expanded, setExpanded ] = useState(false);

  return (
    <div>
      <div className={`grid grid-cols-12 ${bgColor}`}>
        <div className='col-span-3 hover:cursor-pointer' onClick={() => setExpanded(!expanded)}>{material.title} {expanded ? '-' : '+'}</div>
        <div className='text-right'>${material.cost.toFixed(2)}</div>
        <div className='pl-3'>/ {usageSummary.type}</div>
        <div className='col-start-10 text-right'>{usageSummary.amt}</div>
        <div className='col-start-11 pl-3'>{usageSummary.type}</div>
        <div className='col-start-12 text-right'>${usageSummary.cost.toFixed(2)}</div>
      </div>
      {expanded ? <MaterialTable materialId={material.id} isDefaultMaterial={material.id === defaultMaterial} /> : null}
    </div>

  );
}

export default ProjectTableRow;