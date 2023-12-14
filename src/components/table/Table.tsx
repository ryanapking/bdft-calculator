import { RecursiveChild } from '../../data/displaySlice.ts';
import { GROUP } from '../../data/dataTypes.ts';
import TableGroup from './TableGroup.tsx';
import TableRow from './TableRow.tsx';

function Table(props: {data: RecursiveChild}) {
  const { data } = props;

  if (!data) return null;

  function printChild(child: RecursiveChild) {
    switch (child.type) {
      case GROUP: return <TableGroup key={child.id} group={child} />;
      default: return <TableRow key={child.id} rowData={child} />;
    }
  }

  function printChildren(children: Array<RecursiveChild>) {
    return children.map(child => printChild(child));
  }

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
      {/*{printChildren(data.children)}*/}
      <TableGroup group={data} multiplier={data.qty} keepExpanded excludeGroupRow/>
      <div className='grid grid-cols-3'>
        <div></div>
        <div className='grid grid-cols-2'>
          <div className='ml-5 text-right border-t-2'>{data.totalBdft.toFixed(3)}</div>
        </div>
        <div className='grid grid-cols-2'>
          <div className='ml-5 text-right border-t-2'>${data.totalCost.toFixed(2)}</div>
        </div>
      </div>
    </div>

  );
}

export default Table;