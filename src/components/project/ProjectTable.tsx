import { useSelector } from 'react-redux';
import { RootState } from '../../data/store.ts';
import ProjectTableRow from './ProjectTableRow.tsx';

function ProjectTable(props: { projectId: string }) {
  const { projectId } = props;
  const project = useSelector((state: RootState) => state.projects.entities[projectId]);
  const mainGroup = useSelector((state: RootState) => state.groups.entities[project.mainGroup]);
  const projectMaterials = Object.values(mainGroup.calc.list);
  const bgColors = ['bg-gray-200', 'bg-gray-400'];

  return (
    <div className='font-mono min-w-[1200px]'>
      <div className='grid grid-cols-12 border-b-2'>
        <div>Material</div>
        <div></div>
        <div className='col-start-4 text-right'>Price</div>
        <div className='col-start-10 text-right'>Total</div>
        <div className='col-start-12 text-right'>Cost</div>
      </div>
      {projectMaterials.map((usageSummary, index) =>
        <ProjectTableRow key={usageSummary.id} usageSummary={usageSummary} defaultMaterial={project.defaultMaterial} bgColor={bgColors[index % 2]}/>
      )}
      <div className='grid grid-cols-12'>
        <div className='col-start-12 text-right'>${mainGroup.calc.totalCost.toFixed(2)}</div>
      </div>
    </div>
  );
}

export default ProjectTable;