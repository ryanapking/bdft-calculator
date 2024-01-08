import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../data/store.ts';
import { Button, Label, Textarea } from 'flowbite-react';
import { saveProjectUpdates } from '../../data/projectActions.ts';
import { FormEvent, useState } from 'react';

function ProjectForm(props: { projectId: string }) {
  const { projectId} = props;
  const project = useSelector((state: RootState) => state.projects.entities[projectId]);
  const dispatch = useAppDispatch();

  const [ notesInput, setNotesInput ] = useState<string>(project.notes);

  const canSaveNotes = notesInput !== project.notes;

  function saveNotes(e: FormEvent) {
    e.preventDefault();
    if (canSaveNotes) {
      dispatch(saveProjectUpdates(projectId, {notes: notesInput}));
    }
  }

  return (
    <form onSubmit={saveNotes} className='max-w-xl my-6'>
      <Label htmlFor='notes' value='Notes'/>
      <Textarea id='notes' rows={4} value={notesInput} onChange={e => setNotesInput(e.target.value)}/>
      {canSaveNotes ? <Button type='submit' className='mt-3'>Save Notes</Button> : null}
    </form>
  )
}

export default ProjectForm;