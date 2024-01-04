import { ProjectExport } from '../../../data/projectActions.ts';
import { validateProjectImport } from './ImportSchema.ts';
import { DragEvent, useState } from 'react';
import { Alert, FileInput, Label, Modal } from 'flowbite-react';
import { CiImport } from 'react-icons/ci';

type Props = {
  setProjectImport: (projectImport: ProjectExport) => void,
}

function ImportSelect(props: Props) {
  const { setProjectImport } = props;
  const [ errorMsg, setErrorMsg ] = useState('');
  function handleFile(file: File) {
    const jsonExtension = /\.json$/.test(file.name.toLowerCase());
    if (!jsonExtension) {
      setErrorMsg('Please provide a .json file.');
      return;
    }

    const reader = new FileReader();

    reader.onerror = () => {
      setErrorMsg('File read error. Try again.');
    };

    reader.onload = function (e) {
      const result = e.target?.result;
      if (typeof result !== 'string') return;

      let projectImport: ProjectExport;
      try {
        projectImport = JSON.parse(result);
      } catch (e) {
        setErrorMsg('File data cannot be read.');
        return;
      }

      const valid = validateProjectImport(projectImport);
      if (!valid) {
        setErrorMsg('File does not contain a valid project.');
        console.log('File schema errors: ', validateProjectImport.errors);
        return;
      }

      setErrorMsg('');
      setProjectImport(projectImport);
    }

    reader.readAsText(file, "UTF-8");
  }

  function onChange(input: HTMLInputElement) {
    const file = input.files?.[0];
    if (file) handleFile(file);
  }

  function onDrop(e: DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  function onDragOver(e: DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    e.stopPropagation();
  }
  return (
    <Modal.Body>
      {errorMsg ?
        <Alert className='mb-5' color='failure' onDismiss={() => setErrorMsg('')}>
          <span className='font-medium'>Error:</span> {errorMsg}
        </Alert>
        : null
      }
      <Label
        htmlFor='dropzone-file'
        onDrop={onDrop}
        onDragOver={onDragOver}
        className='flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100'
      >
        <div className='flex flex-col items-center justify-center pb-6 pt-5'>
          <CiImport size={'3em'} className='mb-5'/>
          <p className='mb-2 text-sm text-gray-500 text-center'>
            Click to select your project file <br />or<br /> drag and drop
          </p>
          <p className='text-xs text-gray-500'>.json files only</p>
        </div>
        <FileInput
          id='dropzone-file'
          className='hidden'
          accept='.json'
          onChange={(e) => onChange(e.target)}
        />
      </Label>
    </Modal.Body>
  );
}

export default ImportSelect;