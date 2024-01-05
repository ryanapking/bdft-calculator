import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../data/store.ts';
import { setActiveDetails } from '../../data/displaySlice.ts';
import { MISC } from '../../data/dataTypes.ts';
import { ReactElement } from 'react';

function MaterialSummary(props: {materialId: string, projectId: string, groupId: string}) {
  const { materialId, projectId, groupId } = props;
  const material = useSelector((state: RootState) => state.materials.entities[materialId]);
  const group = useSelector((state: RootState) => state.groups.entities[groupId]);
  const activeDetails = useSelector((state: RootState) => state.display.activeDetails);
  const dispatch = useAppDispatch();

  const usageData = group.calc.entities?.[materialId];
  const highlight = materialId === activeDetails.id ? 'bg-gray-200' : '';

  // Hide empty miscellaneous materials
  if (material.type === MISC.id && !usageData) return null;

  const data: { [key: string]: ReactElement|null } = {
    usageCost: usageData ? <p>${usageData.cost.toFixed(2)}</p> : null,
    materialCost: <p>${material.cost.toFixed(2)} / {material.type}</p>,
    usageAmt: usageData ? <p>{usageData.amt} {usageData.type}</p> : <p>unused</p>,
  };

  let displayData = ['usageCost', 'materialCost', 'usageAmt'];
  if (material.type === MISC.id) displayData = ['usageCost'];

  return (
    <div
      className={`text-xs ml-3 pl-1 hover:cursor-pointer hover:underline ${highlight}`}
      onClick={() => dispatch(setActiveDetails({id: materialId, parentId: projectId}))}
    >
      <h3 className={`text-base`}>
        {material.title}
      </h3>
      <div className='pl-5 inline-block'>
        {displayData.map(id => data[id])}
      </div>
    </div>
  );
}

export default MaterialSummary;