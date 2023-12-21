import { useSelector } from 'react-redux';
import { RootState } from '../../data/store.ts';
import ProjectTableRow from './ProjectTableRow.tsx';

function ProjectTable(props: { projectId: string }) {
  const { projectId } = props;
  const project = useSelector((state: RootState) => state.projects.entities[projectId]);
  const mainGroup = useSelector((state: RootState) => state.groups.entities[project.mainGroup]);

  return (
    <div className='font-mono'>
      <div className='grid grid-cols-4 border-b-2'>
        <div>Material</div>
        <div className='text-center'>Price</div>
        <div className='text-center'>Amount</div>
        <div className='text-right'>Total Cost</div>
      </div>
      {Object.values(mainGroup.calc.list).map(usageSummary =>
        <ProjectTableRow key={usageSummary.id} usageSummary={usageSummary} defaultMaterial={project.defaultMaterial} />
      )}
      <div className='grid grid-cols-4'>
        <div></div>
        <div></div>
        <div></div>
        <div className='text-right border-t-2'>${mainGroup.calc.totalCost.toFixed(2)}</div>
      </div>
    </div>
  );
}

export default ProjectTable;