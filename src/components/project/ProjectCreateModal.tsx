import { FormEvent, useEffect, useRef, useState } from 'react';
import { setCreating } from '../../data/displaySlice.ts';
import { Button, Label, Modal, TextInput } from 'flowbite-react';
import { useAppDispatch } from '../../data/store.ts';
import { addProject } from '../../data/projectActions.ts';

function ProjectCreateModal() {
  const dispatch = useAppDispatch();
  const [ projectTitle, setProjectTitle ] = useState('');
  const [ show, setShow ] = useState(false);
  const titleInput = useRef<HTMLInputElement>(null);

  // Trigger the modal after render to get initialFocus to work
  useEffect(() => {
    setShow(true);
  }, []);

  function cancel() {
    dispatch(setCreating(false));
  }

  function create(e: FormEvent) {
    e.preventDefault();
    if (!projectTitle) return;
    dispatch(setCreating(false));
    dispatch(addProject(projectTitle));
  }

  return (
    <Modal show={show} size='xl' popup onClose={cancel} initialFocus={titleInput} dismissible>
      <Modal.Header />
      <Modal.Body>
        <form className='flex flex-col gap-10' onSubmit={e => create(e)}>
          <h1 className='text-3xl font-semibold'>Create a Project</h1>
          <div>
            <Label htmlFor='title' value='Title'/>
            <TextInput
              id='title'
              ref={titleInput}
              value={projectTitle}
              onChange={event => setProjectTitle(event.target.value)}
            />
          </div>

          <div className='flex gap-3 mt-3'>
            <Button className='grow' color='blue' disabled={projectTitle.length === 0} type='submit'>Create</Button>
            <Button className='grow' color='gray' onClick={cancel}>Cancel</Button>
          </div>
        </form>

      </Modal.Body>
    </Modal>
  );
}

export default ProjectCreateModal;