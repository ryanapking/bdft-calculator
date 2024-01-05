import { Dropdown } from 'flowbite-react';
import { setPendingDelete } from '../../data/displaySlice.ts';
import { RootState, useAppDispatch } from '../../data/store.ts';
import { useSelector } from 'react-redux';
import { CiTrash } from 'react-icons/ci';
import PartForm from './PartForm.tsx';
import PartSummary from './PartSummary.tsx';

function PartDetails(props: { partId: string, parentId: string }) {
  const { partId, parentId } = props;
  const part = useSelector((state: RootState) => state.parts.entities[partId]);

  const dispatch = useAppDispatch();
  return (
    <div>
      <Dropdown inline label={<h1 className='text-3xl font-semibold'>{part.title}</h1>}>
        <Dropdown.Item icon={CiTrash} onClick={() => dispatch(setPendingDelete({ id: partId, parentId: parentId }))}>
          Delete Component
        </Dropdown.Item>
      </Dropdown>
      <h5 className='text-xs font-light mb-5'>Component</h5>
      <PartForm partId={partId} />
      <PartSummary partId={partId} />
    </div>
  )
}

export default PartDetails;