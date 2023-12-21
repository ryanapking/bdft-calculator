import { useSelector } from 'react-redux';
import { RootState } from '../../data/store.ts';
import ProjectTableRow from './ProjectTableRow.tsx';

function ProjectTable(props: { projectId: string }) {
  const { projectId } = props;
  const project = useSelector((state: RootState) => state.projects.entities[projectId]);
  const mainGroup = useSelector((state: RootState) => state.groups.entities[project.mainGroup]);
  const projectMaterials = Object.values(mainGroup.calc.list);
  const bgColors = ['bg-neutral-100', 'bg-neutral-300', ];
  const altBorders = ['border-b border-neutral-300', 'border-b border-neutral-100'];

  return (
    <div className='font-mono min-w-[1200px]'>
      <div className='grid grid-cols-12'>
        <div className='pl-3'>Material</div>
        <div className='col-start-8 text-right'>Price</div>
        <div className='col-start-10 text-right'>Total</div>
        <div className='col-start-12 text-right pr-3'>Cost</div>
      </div>
      {projectMaterials.map((usageSummary, index) =>
        <div className={bgColors[index % 2]} key={usageSummary.id}>
          <ProjectTableRow
            usageSummary={usageSummary}
            bgColor={bgColors[index % 2]}
            altBorder={altBorders[index % 2]}
          />
        </div>
      )}
      <div className='grid grid-cols-12'>
        <div className='col-start-12 text-right pr-3'>${mainGroup.calc.totalCost.toFixed(2)}</div>
      </div>
    </div>
  );
}

export default ProjectTable;