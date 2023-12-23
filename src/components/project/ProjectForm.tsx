import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../data/store.ts';
import { Label, Spinner, TextInput } from 'flowbite-react';
import { saveProjectUpdates } from '../../data/projectActions.ts';
import { useState } from 'react';
import useDelayedSave from '../../effects/useDelayedSave.ts';
import MaterialsSelector from '../inputs/MaterialsSelector.tsx';

function ProjectForm(props: {projectId: string}) {
  const { projectId } = props;
  const project = useSelector((state: RootState) => state.projects.entities[projectId]);
  const dispatch = useAppDispatch();

  const [ titleInput, setTitleInput ] = useState<string>(project.title);
  const [ defaultMaterialInput, setDefaultMaterialInput ] = useState<string>(project.defaultMaterial);

  function saveProject() {
    dispatch(saveProjectUpdates({
      id: projectId,
      changes: {
        title: titleInput,
        defaultMaterial: defaultMaterialInput,
      }
    }));
  }

  const savePending = useDelayedSave([titleInput, defaultMaterialInput], saveProject, 500);

  return (
    <form onSubmit={e => e.preventDefault()}>
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
      {savePending ? <Spinner /> : null}
    </form>
  )
}

export default ProjectForm;