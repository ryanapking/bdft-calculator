import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../data/store.ts';
import { setActiveDetails } from '../../data/displaySlice.ts';
import { getMaterialTypeFromId, MISC } from '../../data/dataTypes.ts';
import { calculateMaterialWaste } from '../../data/materialActions.ts';

function MaterialSummary(props: {materialId: string, projectId: string, groupId: string}) {
  const { materialId, projectId, groupId } = props;
  const material = useSelector((state: RootState) => state.materials.entities[materialId]);
  const group = useSelector((state: RootState) => state.groups.entities[groupId]);
  const activeDetails = useSelector((state: RootState) => state.display.activeDetails);
  const dispatch = useAppDispatch();

  const materialType = getMaterialTypeFromId(material.type);
  const usageData = group.calc.entities?.[materialId];
  const { totalAmt, totalCost } = usageData ? calculateMaterialWaste(usageData, material) : {totalCost: 0, totalAmt: 0};
  const highlight = materialId === activeDetails.id ? 'bg-gray-200' : '';

  // Hide empty miscellaneous materials
  if (materialType === MISC && !usageData) return null;

  const usageInfo = [
    <p key={0}>${material.cost.toFixed(2)} / {materialType.shorthand}</p>,
    <p key={1}>{totalAmt} {usageData?.type}</p>,
    <p key={2}>${totalCost.toFixed(2)}</p>,
    <p key={3}>unused</p>
  ];

  let includeUsageInfo = [0, 1, 2];
  if (materialType === MISC) includeUsageInfo = [2];
  else if (!totalAmt) includeUsageInfo = [0, 3];

  return (
    <div
      className={`text-xs ml-3 pl-1 hover:cursor-pointer hover:underline ${highlight}`}
      onClick={() => dispatch(setActiveDetails({id: materialId, parentId: projectId}))}
    >
      <h3 className={`text-base`}>{material.title}</h3>
      <div className='pl-5 inline-block'>
        {includeUsageInfo.map(infoIndex => usageInfo[infoIndex])}
      </div>
    </div>
  );
}

export default MaterialSummary;