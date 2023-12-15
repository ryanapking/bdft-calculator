import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../data/store.ts';
import { Label, TextInput } from 'flowbite-react';
import { deleteProject, updateActiveTable } from '../../data/thunkActions.ts';
import { update as updateProject } from '../../data/projectsSlice.ts';
import { useEffect, useState } from 'react';
import useDelayedSave from '../../effects/useDelayedSave.ts';
import MaterialsSelector from '../inputs/MaterialsSelector.tsx';
import Table from '../table/Table.tsx';
import ButtonConfirm from '../inputs/ButtonConfirm.tsx';

function ProjectDetails(props: {projectId: string}) {
  const { projectId } = props;
  const project = useSelector((state: RootState) => state.projects.all[projectId]);
  const tableData = useSelector((state: RootState) => state.display.activeTableData);
  const dispatch = useAppDispatch();

  const [ titleInput, setTitleInput ] = useState<string>(project.title);
  const [ defaultMaterialInput, setDefaultMaterialInput ] = useState<string>(project.defaultMaterial);

  useEffect(() => {
    console.log('useEffect()');
    dispatch(updateActiveTable());
  }, []);

  function saveForm() {
    const updatedProject = {
      ...project,
      title: titleInput,
      defaultMaterial: defaultMaterialInput,
    };

    console.log('saving project: ', updatedProject);
    dispatch(updateProject({ projectId, project: updatedProject }));
  }

  const savePending = useDelayedSave([titleInput, defaultMaterialInput], saveForm, 2000);

  if (!project) return null;

  return (
    <div>
      <h4>{project.title}</h4>
      <br />
      {tableData ? <Table data={tableData} /> : null}
      <br />
      <form>
        <Label htmlFor='title' value='Project Title' />
        <TextInput id='title' value={titleInput} onChange={event => setTitleInput(event.target.value)} />
        <br />
        <Label htmlFor='defaultMaterial' value='Default Project Material' />
        <MaterialsSelector
          id='defaultMaterial'
          materialIds={project.materials}
          value={defaultMaterialInput}
          onValueChange={value => setDefaultMaterialInput(value)}
        />
        {savePending ? <p>save pending...</p> : null}
        <br />
        <ButtonConfirm color='failure' buttonText={'Delete Project'} onConfirm={() => dispatch(deleteProject(projectId))}>
          Are you sure you want to delete this project? All parts, groups, and materials will be lost.
        </ButtonConfirm>
      </form>

    </div>
  )
}

export default ProjectDetails;