import { useSelector } from 'react-redux';
import { RootState } from '../../data/store.ts';
function ProjectTable(props: {projectId: string}) {
  const { projectId } = props;
  const project = useSelector((state: RootState) => state.projects.all[projectId]);
  const groups = useSelector((state: RootState) => state.groups.all);
  const parts = useSelector((state: RootState) => state.parts.all);
  const materials = useSelector((state: RootState) => state.materials.all);

  type Calculated = {
    id: string,
    title: string,
    qty: number,
    bdft: number,
    cost: number,
    totalCost: number,
    children: Array<Calculated>
  }

  function processPart(partId: string): Calculated {
    const part = parts[partId];
    const material = materials[project.defaultMaterial];
    const bdft = ((part.l * part.w * material.thickness) / 144).toFixed(3);
    const cost = (+bdft * material.cost).toFixed(2);
    const totalCost = +cost * part.qty;
    return {
      id: partId,
      title: part.title,
      qty: part.qty,
      bdft: +bdft,
      cost: +cost,
      totalCost,
      children: [],
    };
  }

  function processGroup(groupId: string): Calculated {
    const group = groups[groupId];

    const children = group.children.map(childId => {
      const childType = getDataTypeFromId(childId);
      switch (childType) {
        case PART: return processPart(childId);
        default: return processGroup(childId);
      }
    });

    const { bdft, cost} = children.reduce((tally, child) => {
      return {
        bdft: tally.bdft + child.bdft,
        cost: tally.cost + child.totalCost,
      }
    }, {bdft: 0, cost: 0});

    return {
      children: children,
      id: groupId,
      title: group.title,
      qty: group.qty,
      bdft,
      cost,
      totalCost: cost * group.qty,
    };
  }

  // const groupArray = buildGroupArray(project.mainGroup);
  const processedArray = processGroup(project.mainGroup);

  function printRow(row: Calculated, depth: number) {
    const leftPad = { paddingLeft: `${depth}rem` };
    const bgColors = ['', 'bg-gray-100', 'bg-gray-200', 'bg-gray-300']
    const bgColor = bgColors[depth % 4];

    return (
      <div>
        {row.children
          ?
          <div className='children'>
            {row.children.map(child => printRow(child, depth + 1))}
          </div>
          : null
        }

        <div className={`grid grid-cols-5 ${bgColor}`}>
          <div style={leftPad} className='font-mono'>{row.title}</div>
          <div className='ml-5 text-right font-mono'>{row.bdft.toFixed(3)}</div>
          <div className='ml-5 text-right font-mono'>${row.cost.toFixed(2)}</div>
          <div className='ml-5 text-right font-mono'>{row.qty}</div>
          <div className='ml-5 text-right font-mono'>${row.totalCost.toFixed(2)}</div>
        </div>

      </div>
    )
  }

  return (
    <div>
      <h1>ProjectTable()</h1>
      <div className='grid grid-cols-5'>
        <div></div>
        <div className='ml-5 text-right font-mono'>Board<br />Feet</div>
        <div className='ml-5 text-right font-mono'>Individual<br />Cost</div>
        <div className='ml-5 text-right font-mono'>Quantity</div>
        <div className='ml-5 text-right font-mono'>Total<br />Cost</div>
      </div>
      {printRow(processedArray, 0)}
    </div>
  );
}

import { getDataTypeFromId, PART } from '../../data/dataTypes.ts';

export default ProjectTable;