import { RecursiveChild } from '../../data/displaySlice.ts';

type Props = {
  rowData: RecursiveChild,
  depth: number,
  shaded?: boolean,
  excludeTotals?: boolean,
  titleAction?: null | (() => void),
  multiplier?: number,
  expandable?: boolean,
  collapsible?: boolean,
}

function TableRow(props: Props) {
  const {
    rowData,
    depth,
    shaded = false,
    titleAction = null,
    excludeTotals = false,
    multiplier = 1,
    expandable = false,
    collapsible = false,
  } = props;

  const prefix = '- '.repeat(depth).substring(2);
  let suffix = expandable ? ' +' : '';
  suffix = collapsible ? ' -' : suffix;
  const titleString = prefix + rowData.title + suffix;
  const title = titleAction ? <span className='hover:cursor-pointer' onClick={() => titleAction()}>{titleString}</span> : titleString;
  const combinedMultiplier = multiplier * rowData.qty;
  const isMultiple = combinedMultiplier > 1;
  const bgClass = shaded ? 'bg-gray-100' : '';

  return (
    <div className={`grid grid-cols-3 ${bgClass}`}>
      <div className='text-left'>{title}</div>
      <div className='grid grid-cols-2'>
        <div className='ml-5 text-right'>
          {excludeTotals ? '' : 9.999.toFixed(3)}
        </div>
        <div className='ml-5'>{isMultiple ? 'x' + combinedMultiplier : ''}</div>
      </div>
      <div className='grid grid-cols-2'>
        <div className='ml-5 text-right'>
          {excludeTotals ? '' : `$${9.99.toFixed(2)}`}
        </div>
        <div className='ml-5'>{isMultiple ? 'x' + combinedMultiplier : ''}</div>
      </div>
    </div>
  )
}

export default TableRow;