import { ComponentPropsWithoutRef, useState } from 'react';
import { Label } from 'flowbite-react';
import TextInput from './TextInput.tsx';
import QuantityInput from './QuantityInput.tsx';
import InchInput from './InchInput.tsx';
import CurrencyInput from './CurrencyInput.tsx';

type Props = ComponentPropsWithoutRef<typeof TextInput> & {
  label?: string,
  stringVal?: string,
  saveString?: (value: string) => void,
  numberVal?: number,
  saveNumber?: (value: number) => void,
  type?: string,
  outerClass?: string,
  suffix?: string,
}

function InlineInput(props: Props) {
  const {
    label = '',
    stringVal = '',
    numberVal = 0,
    saveString = () => {},
    saveNumber = () => {},
    type = 'string',
    outerClass = '',
    suffix = '',
    ...remainingProps
  } = props;

  let value: string|number;
  if (type === 'string') value = stringVal;
  else value = numberVal;

  const [ newValue, setNewValue ] = useState<string|number>(value);

  function startEditing() {
    setNewValue(value);
  }

  function stopEditing() {
    if (newValue === value) return;
    if (type === 'string') saveString(String(newValue));
    else saveNumber(+newValue);
  }

  let inputComponent;

  if(type === 'quantity') inputComponent = (
    <QuantityInput
      {...remainingProps}
      value={+newValue}
      transparent
      suffix={suffix}
      onBlur={stopEditing}
      onFocus={startEditing}
      onValueChange={value => setNewValue(value)}
    />
  );

  if (type === 'inch') inputComponent = (
    <InchInput
      {...remainingProps}
      value={+newValue}
      transparent
      onBlur={stopEditing}
      onFocus={startEditing}
      onValueChange={value => setNewValue(value)}
    />
  );

  if (type === 'currency') inputComponent = (
    <CurrencyInput
      {...remainingProps}
      value={+newValue}
      transparent
      onBlur={stopEditing}
      onFocus={startEditing}
      onValueChange={value => setNewValue(value)}
    />
  );

  if (!inputComponent) inputComponent = (
    <TextInput
      {...remainingProps}
      transparent
      value={newValue}
      onBlur={stopEditing}
      onFocus={startEditing}
      onChange={e => setNewValue(e.target.value)}
    />
  );

  return (
    <div className={`flex flex-col items-center ${outerClass}`}>
      {label ? <Label className='text-xs font-light' value={label}/> : null}
      {inputComponent}
    </div>
  );
}

export default InlineInput;