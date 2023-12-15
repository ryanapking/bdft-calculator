import { useSelector } from 'react-redux';
import { RootState } from '../../data/store.ts';

function MaterialSummary(props: {materialId: string}) {
  const { materialId } = props;
  const material = useSelector((state: RootState) => state.materials.all[materialId])
  const activeData = useSelector((state: RootState) => state.display.activeTableData);

  const materialData = activeData && activeData.materials[materialId] ? activeData.materials[materialId] : null;

  return (
    <div>
      <h3>{material.title}</h3>
      <p className='pl-5'>${material.cost.toFixed(2)}/bdft</p>
      {materialData ?
        <>
          <p className='pl-5'>{materialData.totalBdft} bdft</p>
          <p className='pl-5'>${materialData.totalCost.toFixed(2)}</p>
        </>
        :
        <p className='pl-5'>unused</p>
      }
    </div>
  );
}

export default MaterialSummary;