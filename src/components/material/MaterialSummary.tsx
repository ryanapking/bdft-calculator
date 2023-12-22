import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../data/store.ts';
import { setActiveDetails } from '../../data/displaySlice.ts';

function MaterialSummary(props: {materialId: string, projectId: string, groupId: string}) {
  const { materialId, projectId, groupId } = props;
  const material = useSelector((state: RootState) => state.materials.entities[materialId]);
  const group = useSelector((state: RootState) => state.groups.entities[groupId]);
  const dispatch = useAppDispatch();

  const materialData = group.calc.entities?.[materialId];

  return (
    <div className='text-xs pl-3'>
      <h3
        className='text-base hover:cursor-pointer hover:underline'
        onClick={() => dispatch(setActiveDetails({id: materialId, parentId: projectId}))}
      >
        {material.title}
      </h3>
      <p className='pl-5'>${material.cost.toFixed(2)} / {material.type}</p>
      {materialData ?
        <>
          <p className='pl-5'>{materialData.amt} {materialData.type}</p>
          <p className='pl-5'>${materialData.cost.toFixed(2)}</p>
        </>
        :
        <p className='pl-5'>unused</p>
      }
    </div>
  );
}

export default MaterialSummary;