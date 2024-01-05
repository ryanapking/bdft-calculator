import { useSelector } from 'react-redux';
import { RootState } from '../../../data/store.ts';
import { LFT } from '../../../data/dataTypes.ts';

type Props = {
  partId: string,
  altBorder: string,
  multiplier: number,
}

function MaterialTablePartRow(props: Props) {
  const {
    partId,
    altBorder,
    multiplier = 1,
  } = props;
  const part = useSelector((state: RootState) => state.parts.entities[partId]);
  const usage = part.calc.entities[part.calc.ids[0]];

  let partDimensions = `${part.l}" x ${part.w}"`;
  if (usage.type === LFT.id) partDimensions = `${part.l}"`;

  return (
    <div className={`grid grid-cols-12`}>
      <div className={`col-span-4 pl-3 ${altBorder}`}>{part.title}</div>
      <div className={`col-span-3 ${altBorder}`}>{partDimensions}</div>
      <div className={`col-span-3 text-right ${altBorder}`}>{usage.amt.toFixed(3)}</div>
      <div className={`col-span-2 text-right pr-3 ${altBorder}`}>{part.qty * multiplier}</div>
    </div>
  );
}

export default MaterialTablePartRow;