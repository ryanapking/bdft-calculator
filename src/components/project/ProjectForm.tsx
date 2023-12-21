import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../data/store.ts';
import { Label, TextInput } from 'flowbite-react';
import { deleteProject, saveProjectUpdates } from '../../data/projectActions.ts';
import { useState } from 'react';
import useDelayedSave from '../../effects/useDelayedSave.ts';
import MaterialsSelector from '../inputs/MaterialsSelector.tsx';
import ButtonConfirm from '../inputs/ButtonConfirm.tsx';
import ProjectTable from './ProjectTable.tsx';

function ProjectForm(props: {projectId: string}) {
  const { projectId } = props;
  const project = useSelector((state: RootState) => state.projects.entities[projectId]);
  const dispatch = useAppDispatch();

  const [ titleInput, setTitleInput ] = useState<string>(project.title);
  const [ defaultMaterialInput, setDefaultMaterialInput ] = useState<string>(project.defaultMaterial);

  function saveForm() {
    dispatch(saveProjectUpdates({
      id: projectId,
      changes: {
        title: titleInput,
        defaultMaterial: defaultMaterialInput,
      }
    }));
  }

  const savePending = useDelayedSave([titleInput, defaultMaterialInput], saveForm, 2000);

  if (!project) return null;

  return (
    <div>
      <h4>{project.title}</h4>
      <br />
      <ProjectTable projectId={project.id} />
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

export default ProjectForm;