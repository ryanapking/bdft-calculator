import { Alert, FileInput, Label, Modal } from 'flowbite-react';
import { CiImport } from 'react-icons/ci';
import { DragEvent, useState } from 'react';
import { useAppDispatch } from '../../../data/store.ts';
import { endImport } from '../../../data/displaySlice.ts';
import { importProject, ProjectExport } from '../../../data/projectActions.ts';
import { projectImportSchema } from './ImportSchema.ts';
import Ajv from 'ajv';

function ImportModal() {
  const dispatch = useAppDispatch();
  const [ errorMsg, setErrorMsg ] = useState('');

  function handleFile(file: File) {
    const jsonExtension = /\.json$/.test(file.name.toLowerCase());
    if (!jsonExtension) {
      setErrorMsg('Please provide a .json file.');
      return;
    }

    const reader = new FileReader();

    reader.onerror = () => {
      setErrorMsg('Error reading the file. Try again.');
    };

    reader.onload = function (e) {
      const result = e.target?.result;
      if (typeof result !== 'string') return;

      let projectImport: unknown;
      try {
        projectImport = JSON.parse(result);
      } catch (e) {
        setErrorMsg('This is not a valid JSON file.');
      }

      const ajv = new Ajv();
      const validateProjectImport = ajv.compile(projectImportSchema);
      const valid = validateProjectImport(projectImport);
      if (!valid) {
        setErrorMsg('This file does not contain a valid project.');
        console.log('File schema errors: ', validateProjectImport.errors);
        return;
      }

      setErrorMsg('');
      dispatch(importProject(projectImport as ProjectExport));
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
    <Modal show={true} size='xl' popup onClose={() => dispatch(endImport())}>
      <Modal.Header />
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
    </Modal>
  );
}

export default ImportModal;