import { useSelector } from 'react-redux';
import { RootState } from '../../../data/store.ts';
import ProjectTableRow from './ProjectTableRow.tsx';
import { calculateListWithWaste } from '../../../data/materialActions.ts';

function ProjectTable(props: { projectId: string }) {
  const { projectId } = props;
  const project = useSelector((state: RootState) => state.projects.entities[projectId]);
  const mainGroup = useSelector((state: RootState) => state.groups.entities[project.mainGroup]);
  const materials = useSelector((state: RootState) => state.materials.entities);

  const projectCost = calculateListWithWaste(mainGroup.calc, materials);
  const bgColors = ['bg-neutral-100', 'bg-neutral-300', ];
  const altBorders = ['border-t border-neutral-300', 'border-t border-neutral-100'];

  return (
    <div className='font-mono min-w-[1200px]'>
      <div className='grid grid-cols-12 py-1'>
        <div className=' col-span-4 mb-1 text-2xl'>Material Usage</div>
        <div className='col-start-8 text-right self-end'>Amount</div>
        <div className='col-start-10 text-right self-end'>Cost</div>
        <div className='col-start-12 text-right pr-3 self-end'>Total</div>
      </div>
      {mainGroup.calc.ids.map((materialId, index) =>
        <div className={bgColors[index % 2]} key={materialId}>
          <ProjectTableRow
            usageSummary={mainGroup.calc.entities[materialId]}
            bgColor={bgColors[index % 2]}
            altBorder={altBorders[index % 2]}
          />
        </div>
      )}
      <div className='grid grid-cols-12 py-1'>
        <div className='col-start-12 text-right pr-3'>${projectCost.toFixed(2)}</div>
      </div>
    </div>
  );
}

export default ProjectTable;