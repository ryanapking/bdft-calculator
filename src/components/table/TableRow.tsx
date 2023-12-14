import { RecursiveChild } from '../../data/displaySlice.ts';

function TableRow(props: {rowData: RecursiveChild, depth: number, excludeTotals: boolean, titleAction: () => void | null }) {
  const { rowData, depth, titleAction, excludeTotals = false } = props;
  const prefix = '-'.repeat(depth).substring(1);
  const titleString = prefix + rowData.title;
  const title = titleAction ? <span className='hover:cursor-pointer' onClick={() => titleAction()}>{titleString}</span> : titleString;
  const isMultiple = rowData.qty > 1;
  return (
    <div className='grid grid-cols-3'>
      <div className='text-left'>{title}</div>
      <div className='grid grid-cols-2'>
        <div className='ml-5 text-right'>
          {excludeTotals ? '' : rowData.bdft.toFixed(3)}
        </div>
        <div className='ml-5'>{isMultiple ? 'x' + rowData.qty : ''}</div>
      </div>
      <div className='grid grid-cols-2'>
        <div className='ml-5 text-right'>
          {excludeTotals ? '' : `${rowData.cost.toFixed(2)}`}
        </div>
        <div className='ml-5'>{isMultiple ? 'x' + rowData.qty : ''}</div>
      </div>
    </div>
  )
}

export default TableRow;