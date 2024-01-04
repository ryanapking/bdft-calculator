import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../data/store.ts';
import { Label, Spinner, Textarea, TextInput } from 'flowbite-react';
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
  const [ notesInput, setNotesInput ] = useState<string>(project.notes);

  function saveProject() {
    dispatch(saveProjectUpdates({
      id: projectId,
      changes: {
        title: titleInput,
        defaultMaterial: defaultMaterialInput,
        notes: notesInput,
      }
    }));
  }

  const savePending = useDelayedSave([titleInput, defaultMaterialInput], saveProject, 500);

  const classes = {
    form: 'my-5',
    inputGroup: 'max-w-md my-1 w-full',
  };

  return (
    <form className={classes.form} onSubmit={e => e.preventDefault()}>
      <div className={classes.inputGroup}>
        <Label htmlFor='title' value='Project Title'/>
        <TextInput id='title' value={titleInput} onChange={event => setTitleInput(event.target.value)}/>
      </div>
      <div className={classes.inputGroup}>
        <Label htmlFor='defaultMaterial' value='Default Project Material'/>
        <MaterialsSelector
          id='defaultMaterial'
          materialIds={project.materials}
          value={defaultMaterialInput}
          onValueChange={value => setDefaultMaterialInput(value)}
        />
      </div>
      <div className={classes.inputGroup}>
        <Label htmlFor='notes' value='Notes'/>
        <Textarea id='notes' rows={4} value={notesInput} onChange={e => setNotesInput(e.target.value)}/>
      </div>
      {savePending ? <Spinner/> : null}
    </form>
  )
}

export default ProjectForm;