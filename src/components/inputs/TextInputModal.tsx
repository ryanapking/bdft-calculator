import { FormEvent, PropsWithChildren, useEffect, useRef, useState } from 'react';
import { Button, Label, Modal } from 'flowbite-react';
import TextInput from './TextInput.tsx';

type Props = {
  submitText?: string,
  initialText?: string,
  inputLabel?: string,
  id?: string,
  onSubmit: (title: string) => void,
  close: () => void,
}

function TextInputModal(props: PropsWithChildren<Props>) {
  const {
    onSubmit,
    close,
    id = '',
    inputLabel = '',
    children,
    initialText = '',
    submitText = 'Submit',
  } = props;

  const [ projectTitle, setProjectTitle ] = useState(initialText);
  const [ show, setShow ] = useState(false);
  const titleInput = useRef<HTMLInputElement>(null);

  // Trigger the modal after render to get initialFocus to work
  useEffect(() => {
    setShow(true);
  }, []);

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!projectTitle) return;
    onSubmit(projectTitle);
    close();
  }

  return (
    <Modal show={show} size='xl' popup onClose={close} initialFocus={titleInput} dismissible>
      <Modal.Header />
      <Modal.Body>
        {children}
        <form onSubmit={e => submit(e)}>
          <div className='mb-5'>
            {inputLabel ? <Label htmlFor={id} value={inputLabel}/> : null}
            <TextInput
              id={id}
              ref={titleInput}
              value={projectTitle}
              onChange={event => setProjectTitle(event.target.value)}
            />
          </div>
          <div className='grid grid-cols-2 gap-3'>
            <Button color='blue' disabled={projectTitle.length === 0} type='submit'>{submitText}</Button>
            <Button color='gray' onClick={close}>Cancel</Button>
          </div>
        </form>

      </Modal.Body>
    </Modal>
  );
}

export default TextInputModal;