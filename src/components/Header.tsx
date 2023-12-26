import { Dropdown } from 'flowbite-react';
import { useSelector} from 'react-redux';
import { RootState, useAppDispatch } from '../data/store.ts';
import { setActiveProject } from '../data/displaySlice.ts';
import { addProject } from '../data/projectActions.ts';

function Header() {
  const projectIds = useSelector((state: RootState) => state.projects.ids);
  const projects = useSelector((state: RootState) => state.projects.entities);

  const dispatch = useAppDispatch();

  return (
    <div className='w-full flex justify-between mb-10'>
      <h1 className='text-3xl font-semibold'>Woodworking Calculator</h1>

      <Dropdown label="Projects">
        <Dropdown.Header>Load Project</Dropdown.Header>
        {projectIds.map(id =>
          <Dropdown.Item key={id} onClick={() => dispatch(setActiveProject(id))}>{projects[id].title}</Dropdown.Item>
        )}
        <Dropdown.Divider />
        <Dropdown.Item onClick={() => dispatch(addProject())}>Create</Dropdown.Item>
      </Dropdown>
    </div>
  );
}

export default Header;