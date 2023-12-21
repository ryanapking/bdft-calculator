import { useSelector } from 'react-redux';
import { RootState } from '../../data/store.ts';

type Props = {
  partId: string,
  materialId: string,
  isDefaultMaterial: boolean,
  bgColor: string,
  multiplier: number,
}

function MaterialTablePartRow(props: Props) {
  const {
    partId,
    materialId,
    bgColor,
    multiplier = 1,
    isDefaultMaterial = false
  } = props;
  const part = useSelector((state: RootState) => state.parts.entities[partId]);

  // doesn't match, but might be default material
  if (part.m && part.m !== materialId) return null;

  // is not default material
  if (!part.m && !isDefaultMaterial) return null;

  const usage = Object.values(part.calc.list)[0];

  return (
    <>
      <div className={`grid grid-cols-12 ${bgColor}`}>
        <div className='col-span-3 pl-10'>{part.title}</div>
        <div className='col-start-7'>{part.l} x {part.w}</div>
        <div className='col-start-8 text-right'>{usage.amt.toFixed(3)}</div>
        <div className='col-start-9 text-right'>{part.qty * multiplier}</div>
      </div>
    </>
  );
}

export default MaterialTablePartRow;