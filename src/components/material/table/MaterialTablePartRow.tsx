import { useSelector } from 'react-redux';
import { RootState } from '../../../data/store.ts';
import { MaterialType, MISC, LFT } from '../../../data/dataTypes.ts';
import DecimalAligned from './DecimalAligned.tsx';

type Props = {
  partId: string,
  altBorder: string,
  multiplier: number,
  materialType: MaterialType
}

function MaterialTablePartRow(props: Props) {
  const {
    partId,
    altBorder,
    materialType,
    multiplier = 1
  } = props;
  const part = useSelector((state: RootState) => state.parts.entities[partId]);
  const usage = part.calc.entities[part.calc.ids[0]];

  let tableRow = (
    <>
      <div className='col-span-4 pl-3'>{part.title}</div>
      <div className='col-span-2 text-center'><DecimalAligned num={part.l} /></div>
      <div className='col-span-2 text-center'><DecimalAligned num={part.w} /></div>
      <div className='col-span-2 text-right'><DecimalAligned num={usage.amt} /></div>
      <div className='col-span-2 text-right pr-3'>{part.qty * multiplier}</div>
    </>
  );

  if (materialType === MISC) tableRow = (
    <>
      <div className='col-span-8 pl-3'>{part.title}</div>
      <div className='col-span-2 text-right'><DecimalAligned num={part.c} currency /></div>
      <div className='col-span-2 text-right pr-3'>{part.qty * multiplier}</div>
    </>
  );

  if (materialType === LFT) tableRow = (
    <>
      <div className='col-span-4 pl-3'>{part.title}</div>
      <div className='col-span-2 text-center'><DecimalAligned num={part.l}/></div>
      <div className='col-span-2'></div>
      <div className='col-span-2 text-right'><DecimalAligned num={usage.amt}/></div>
      <div className='col-span-2 text-right pr-3'>{part.qty * multiplier}</div>
    </>
  );

  return (
    <div className={`grid grid-cols-12 ${altBorder}`}>
      {tableRow}
    </div>
  );
}

export default MaterialTablePartRow;