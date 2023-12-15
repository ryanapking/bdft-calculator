import { Navbar, Dropdown } from 'flowbite-react';
import { useSelector} from 'react-redux';
import { RootState, useAppDispatch } from '../data/store.ts';
import { setActiveProject } from '../data/displaySlice.ts';
import { addProject } from '../data/thunkActions.ts';

function Header() {
  const projects = useSelector((state: RootState) => state.projects.all)

  const projectIds = Object.keys(projects);
  const dispatch = useAppDispatch();

  return (
    <>
      <Navbar fluid rounded>
        <Navbar.Brand href="https://flowbite-react.com">
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Woodworking Calculator</span>
        </Navbar.Brand>
        <Dropdown label="Projects">
          <Dropdown.Header>Load Project</Dropdown.Header>
          {projectIds.map(id =>
            <Dropdown.Item key={id} onClick={() => dispatch(setActiveProject(id))}>{projects[id].title}</Dropdown.Item>
          )}
          <Dropdown.Divider />
          <Dropdown.Item onClick={() => dispatch(addProject())}>Create</Dropdown.Item>
        </Dropdown>
        <Navbar.Toggle />
      </Navbar>
    </>
  );
}

export default Header;