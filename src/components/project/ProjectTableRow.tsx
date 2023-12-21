import { MaterialUsageSummary } from '../../data/materialsSlice.ts';
import { useSelector } from 'react-redux';
import { RootState } from '../../data/store.ts';
import MaterialTable from '../material/MaterialTable.tsx';
import { useState } from 'react';

function ProjectTableRow(props: { usageSummary: MaterialUsageSummary, defaultMaterial: string}) {
  const { usageSummary, defaultMaterial} = props;
  const material = useSelector((state: RootState) => state.materials.entities[usageSummary.id]);

  const [ expanded, setExpanded ] = useState(false);

  return (
    <div>
      <div className='grid grid-cols-4'>
        <div className='hover:cursor-pointer' onClick={() => setExpanded(!expanded)}>{material.title} {expanded ? '-' : '+'}</div>
        <div className='grid grid-cols-2'>
          <div className='ml-5 text-right'>${material.cost.toFixed(2)}</div>
          <div className='ml-3'>/ {usageSummary.type}</div>
        </div>
        <div className='grid grid-cols-2'>
          <div className='ml-5 text-right'>{usageSummary.amt}</div>
          <div className='ml-3'>{usageSummary.type}</div>
        </div>
        <div className='ml-5 text-right'>${usageSummary.cost.toFixed(2)}</div>
      </div>
      {expanded ? <MaterialTable materialId={material.id} isDefaultMaterial={material.id === defaultMaterial} /> : null}
    </div>

  );
}

export default ProjectTableRow;