import { useSelector } from 'react-redux';
import { RootState } from '../data/store.ts';

function MaterialDetails(props:{materialId: string, parentId: string}) {
  const { materialId } = props;
  const material = useSelector((state: RootState) => state.materials.all[materialId]);

  if (!material) return null;

  return (
    <div className='m-2'>
      <h4>Material : {materialId} : {material.title}</h4>
    </div>
  )
}

export default MaterialDetails;