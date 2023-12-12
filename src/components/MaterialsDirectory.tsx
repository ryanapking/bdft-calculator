import MaterialLink from './MaterialLink.tsx';
import { useAppDispatch } from '../data/store.ts';
import { addMaterialToProject } from '../data/thunkActions.ts';
import { Dropdown } from 'flowbite-react';

function MaterialsDirectory(props: {materials: Array<string>, projectId: string}) {
  const { materials, projectId } = props;
  const dispatch = useAppDispatch();

  return (
    <div className={'mt-2 mb-2'}>
      <Dropdown inline label='Project Materials'>
        <Dropdown.Item onClick={() => dispatch(addMaterialToProject(projectId))}>Add Material</Dropdown.Item>
      </Dropdown>
      <ul className={'ml-4'}>
        {materials.map(id => <MaterialLink key={id} materialId={id} parentId={projectId} /> )}
      </ul>
    </div>
  )
}

export default MaterialsDirectory;