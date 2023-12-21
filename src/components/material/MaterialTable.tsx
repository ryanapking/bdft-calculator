import { useSelector } from 'react-redux';
import { RootState } from '../../data/store.ts';
import MaterialTableGroupRow from './MaterialTableGroupRow.tsx';

function MaterialTable(props: {materialId: string, isDefaultMaterial: boolean}) {
  const { materialId, isDefaultMaterial = false} = props;
  const project = useSelector((state: RootState) => state.projects.entities[state.display.activeProject]);

  return (
    <div className='font-mono'>
      <div className='grid grid-cols-4'>
        <div></div>
        <div className='border-b-2'>Part</div>
        <div className='text-center border-b-2'>Amount</div>
        <div></div>
      </div>
      <MaterialTableGroupRow materialId={materialId} groupId={project.mainGroup} isDefaultMaterial={isDefaultMaterial}/>
    </div>
  );
}

export default MaterialTable;