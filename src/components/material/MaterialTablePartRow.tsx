import { useSelector } from 'react-redux';
import { RootState } from '../../data/store.ts';

function MaterialTablePartRow(props: {partId: string, materialId: string, isDefaultMaterial: boolean}) {
  const { partId, materialId , isDefaultMaterial = false} = props;
  const part = useSelector((state: RootState) => state.parts.entities[partId]);

  // doesn't match, but might be default material
  if (part.m && part.m !== materialId) return null;

  // is not default material
  if (!part.m && !isDefaultMaterial) return null;

  const usage = Object.values(part.calc.list)[0];

  return (
    <div>
      <div className='grid grid-cols-4'>
        <div></div>
        <div>{part.title}</div>
        <div className='text-center'>{usage.amt}</div>
        <div></div>
      </div>
    </div>
  );
}

export default MaterialTablePartRow;