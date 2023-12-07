import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../data/store.ts";
import { setActiveProject } from "../data/displaySlice.ts";
import { addProject } from "../data/thunkActions.ts";

function ProjectsList() {
  const list = useSelector((state: RootState) => state.projects.all)

  const projectIds = Object.keys(list);
  const dispatch = useAppDispatch();

  return (
    <>
      <h4>Projects:</h4>
      {projectIds.map(id =>
        <p key={id} onClick={() => dispatch(setActiveProject(id))}>{id}</p>
      )}
      <button onClick={() => dispatch(addProject())}>Create project</button>
    </>
  )
}

export default ProjectsList;