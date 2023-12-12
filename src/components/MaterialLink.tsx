import { useSelector } from 'react-redux';
import { RootState } from '../data/store.ts';
import { useAppDispatch } from '../data/store.ts';
import { setActiveDetails } from '../data/displaySlice.ts';

function MaterialLink(props:{materialId: string, parentId: string}) {
  const { materialId, parentId } = props;
  const material = useSelector((state: RootState) => state.materials.all[materialId]);
  const dispatch = useAppDispatch();

  return (
    <div>
      <h4 className='hover:cursor-pointer hover:underline' onClick={() => dispatch(setActiveDetails({id: materialId, parentId}))}>{material.title ? material.title : 'Unnamed Material'}</h4>
    </div>
  )
}

export default MaterialLink;