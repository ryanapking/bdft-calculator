import { useSelector } from 'react-redux';
import { RootState } from '../../data/store.ts';
import { getMaterialTypeFromId } from '../../data/dataTypes.ts';

function PartSummary(props: {partId: string}) {
  const { partId } = props;
  const part = useSelector((state: RootState) => state.parts.entities[partId]);
  const usage = Object.values(part.calc.list)[0];
  const materialType = getMaterialTypeFromId(usage.type);

  return (
    <div>
      <p>${usage.cost.toFixed(2)}</p>
      <p>{usage.amt} {materialType.shorthand}</p>
    </div>
  )
}

export default PartSummary;