import { Dropdown } from 'flowbite-react';
import { setAlert, setPendingDelete } from '../../data/displaySlice.ts';
import { deleteAlerts } from '../../data/messages.ts';
import { MATERIAL, MISC } from '../../data/dataTypes.ts';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../data/store.ts';
import { CiTrash } from 'react-icons/ci';
import MaterialForm from './MaterialForm.tsx';
import MaterialTable from './table/MaterialTable.tsx';

function MaterialDetails(props:{materialId: string, parentId: string}) {
  const { materialId, parentId } = props;
  const material = useSelector((state: RootState) => state.materials.entities[materialId]);
  const project = useSelector((state: RootState) => state.projects.entities[parentId]);
  const isDefaultMaterial = materialId === project.defaultMaterial;
  const dispatch = useAppDispatch();

  function attemptDelete() {
    if (isDefaultMaterial) {
      dispatch(setAlert(deleteAlerts[MATERIAL.idPrefix]));
    } else {
      dispatch(setPendingDelete({id: materialId, parentId: project.id}));
    }
  }

  return (
    <div>
      <Dropdown inline label={<h1 className='text-3xl font-semibold'>{material.title}</h1>}>
        <Dropdown.Item icon={CiTrash} onClick={() => attemptDelete()}>Delete Material</Dropdown.Item>
      </Dropdown>
      <h5 className='text-xs font-light mb-5'>Material</h5>
      {material.type === MISC.id ? null : <MaterialForm materialId={materialId} />}
      <div className='p-6 bg-gray-100 max-w-3xl'>
        <h3 className='text-xl font-semibold pl-3'>{material.title} Components</h3>
        <MaterialTable materialId={materialId} altBorder={'border-b border-gray-300'} />
      </div>
    </div>
  )
}

export default MaterialDetails;