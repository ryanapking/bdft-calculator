import { useSelector } from 'react-redux';
import { RootState } from '../../data/store.ts';

function MaterialSummary(props: {materialId: string, groupId: string}) {
  const { materialId, groupId } = props;
  const material = useSelector((state: RootState) => state.materials.entities[materialId]);
  const group = useSelector((state: RootState) => state.groups.entities[groupId]);

  const materialData = group.calc.entities?.[materialId];

  return (
    <div>
      <h3>{material.title}</h3>
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