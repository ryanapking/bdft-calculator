import { useSelector } from 'react-redux';
import { RootState } from '../../data/store.ts';
import { getMaterialTypeFromId } from '../../data/dataTypes.ts';

function PartSummary(props: {partId: string}) {
  const { partId } = props;
  const part = useSelector((state: RootState) => state.parts.entities[partId]);
  const materialType = getMaterialTypeFromId(part.calc.type);

  return (
    <div>
      <p>${part.calc.cost.toFixed(2)}</p>
      <p>{part.calc.amt} {materialType.shorthand}</p>
    </div>
  )
}

export default PartSummary;