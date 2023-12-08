import { useSelector } from 'react-redux';
import { RootState } from '../data/store.ts';
import { Dropdown } from 'flowbite-react';
import { deletePart } from '../data/thunkActions.ts';
import { useAppDispatch } from '../data/store.ts';

function Part(props: {partId: string, parentId: string}) {
  const { partId, parentId} = props;
  const part = useSelector((state: RootState) => state.parts.all[partId]);
  const dispatch = useAppDispatch();
  return (
    <div className='m-2'>
      <Dropdown inline label={`Part : ${partId} : ${part.title}`}>
        <Dropdown.Item onClick={() => dispatch(deletePart(parentId, partId ))}>Delete Part</Dropdown.Item>
      </Dropdown>
    </div>
  )
}

export default Part;