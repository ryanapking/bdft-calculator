import { Dropdown } from 'flowbite-react';
import { useSelector} from 'react-redux';
import { RootState, useAppDispatch } from '../data/store.ts';
import { beginImport, setActiveProject } from '../data/displaySlice.ts';
import { addProject } from '../data/projectActions.ts';
import { FcCalculator } from 'react-icons/fc';
import { RxPlusCircled } from 'react-icons/rx';
import { CiImport } from 'react-icons/ci';

function Header() {
  const projectIds = useSelector((state: RootState) => state.projects.ids);
  const projects = useSelector((state: RootState) => state.projects.entities);

  const dispatch = useAppDispatch();

  return (
    <div className='w-full border-b-2 flex px-4 py-2 items-center justify-between'>
      <div className='flex gap-3 items-center'>
        <FcCalculator size={'2em'} />
        <h1 className='text-3xl font-semibold'>Woodworking Calculator</h1>
      </div>

      <div className='flex items-center gap-6'>
        <button className=''>How to Use</button>
        <Dropdown inline label="Your Projects" size={'xs'}>
          {projectIds.map(id =>
            <Dropdown.Item key={id} onClick={() => dispatch(setActiveProject(id))}>{projects[id].title}</Dropdown.Item>
          )}
          <Dropdown.Divider />
          <Dropdown.Item icon={CiImport} onClick={() => dispatch(beginImport())}>Import Project</Dropdown.Item>
          <Dropdown.Item icon={RxPlusCircled} onClick={() => dispatch(addProject())}>Create</Dropdown.Item>
        </Dropdown>
      </div>

    </div>
  );
}

export default Header;