import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../data/store.ts";
import { create } from "../data/projectsSlice.ts";
import { setActiveProject } from "../data/displaySlice.ts";

function ProjectsList() {
  const list = useSelector((state: RootState) => state.projects.all)

  const projectIds = Object.keys(list);
  const dispatch = useDispatch()

  return (
    <>
      <h4>Projects:</h4>
      {projectIds.map(id =>
        <p key={id} onClick={() => dispatch(setActiveProject(id))}>{id}</p>
      )}
      <button onClick={() => dispatch(create())}>Create project</button>
    </>
  )
}

export default ProjectsList