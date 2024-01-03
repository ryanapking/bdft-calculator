import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../data/store.ts';
import { setActiveDetails } from '../../data/displaySlice.ts';
import { MISC } from '../../data/dataTypes.ts';

function MaterialSummary(props: {materialId: string, projectId: string, groupId: string}) {
  const { materialId, projectId, groupId } = props;
  const material = useSelector((state: RootState) => state.materials.entities[materialId]);
  const group = useSelector((state: RootState) => state.groups.entities[groupId]);
  const dispatch = useAppDispatch();

  const usageData = group.calc.entities?.[materialId];

  if (material.type === MISC.id) {
    if (!usageData) return null;
    return (
      <div className='text-xs pl-3'>
        <h3 className='text-base'>{material.title}</h3>
        <p className='pl-5'>${usageData.cost.toFixed(2)}</p>
      </div>
    );
  }

  function loadDetails() {
    dispatch(setActiveDetails({id: materialId, parentId: projectId}));
  }

  return (
    <div className='text-xs pl-3'>
      <h3 onClick={loadDetails} className='text-base hover:cursor-pointer hover:underline'>
        {material.title}
      </h3>
      <p className='pl-5'>${material.cost.toFixed(2)} / {material.type}</p>
      {usageData ?
        <>
          <p className='pl-5'>{usageData.amt} {usageData.type}</p>
          <p className='pl-5'>${usageData.cost.toFixed(2)}</p>
        </>
        :
        <p className='pl-5'>unused</p>
      }
    </div>
  );
}

export default MaterialSummary;