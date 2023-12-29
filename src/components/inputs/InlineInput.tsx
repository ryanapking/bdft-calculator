import { ComponentProps, useState } from 'react';
import { CustomFlowbiteTheme, Label, TextInput } from 'flowbite-react';
import QuantityInput from './QuantityInput.tsx';
import InchInput from './InchInput.tsx';

const customTheme: CustomFlowbiteTheme['textInput'] = {
  field: {
    input: {
      colors: {
        transparent: 'bg-transparent border-transparent',
      }
    }
  },
};

type Props = ComponentProps<typeof TextInput> & {
  label?: string,
  stringVal?: string,
  saveString?: (value: string) => void,
  numberVal?: number,
  saveNumber?: (value: number) => void,
  type?: string,
}

function InlineInput(props: Props) {
  const {
    label = '',
    stringVal = '',
    numberVal = 0,
    saveString = () => {},
    saveNumber = () => {},
    type = 'string',
    ...remainingProps
  } = props;

  let value: string|number;
  if (type === 'string') value = stringVal;
  else value = numberVal;

  const [ editing, setEditing ] = useState(false);
  const [ newValue, setNewValue ] = useState<string|number>(value);

  function startEditing() {
    setNewValue(value);
    setEditing(true);
  }

  function stopEditing() {
    setEditing(false);
    if (newValue === value) return;
    if (type === 'string') saveString(String(newValue));
    else saveNumber(+newValue);
  }

  let AltComponent = null;
  if (type === 'quantity') AltComponent = QuantityInput;
  else if (type === 'inch') AltComponent = InchInput;

  if (AltComponent) {
    return (
      <div className='flex gap-2 items-center'>
        {label ? <Label value={label + ':'}/> : null}
        <AltComponent
          {...remainingProps}
          value={newValue}
          theme={customTheme}
          color={editing ? 'gray' : 'transparent'}
          onBlur={stopEditing}
          onFocus={startEditing}
          onValueChange={value => setNewValue(value)}
        />
      </div>
    );
  }

  return (
    <div className='flex gap-2 items-center'>
      {label ? <Label value={label + ':'}/> : null}
      <TextInput
        {...remainingProps}
        value={newValue}
        theme={customTheme}
        color={editing ? 'gray' : 'transparent'}
        onBlur={stopEditing}
        onFocus={startEditing}
        onChange={e => setNewValue(e.target.value)}
      />
    </div>
  );
}

export default InlineInput;