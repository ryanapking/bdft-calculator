import { RecursiveChild } from '../../data/displaySlice.ts';
import TableGroup from './TableGroup.tsx';

function Table(props: {data: RecursiveChild}) {
  const { data } = props;

  if (!data) return null;

  return (
    <div className='font-mono'>
      <div className='grid grid-cols-3'>
        <div></div>
        <div className='grid grid-cols-2'>
          <div className='ml-5 text-right border-b-2'>BdFt</div>
        </div>
        <div className='grid grid-cols-2'>
          <div className='ml-5 text-right border-b-2'>Cost</div>
        </div>
      </div>
      <TableGroup group={data} multiplier={data.qty} depth={0} keepExpanded excludeGroupRow/>
      <div className='grid grid-cols-3'>
        <div></div>
        <div className='grid grid-cols-2'>
          <div className='ml-5 text-right border-t-2'>{9.999.toFixed(3)}</div>
        </div>
        <div className='grid grid-cols-2'>
          <div className='ml-5 text-right border-t-2'>${9.99.toFixed(2)}</div>
        </div>
      </div>
    </div>

  );
}

export default Table;