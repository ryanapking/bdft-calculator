import { ComponentPropsWithoutRef } from 'react';
import TextInput from './TextInput.tsx';
import SuffixTextInput from './SuffixTextInput.tsx';

const intRegex = /^\d{0,4}$/;

type Props = Omit<ComponentPropsWithoutRef<typeof SuffixTextInput>, 'value' | 'suffix'> & {
  value: number,
  suffix?: string,
  onValueChange: ( _:number ) => void,
}

function QuantityInput(props: Props) {
  const {
    onValueChange,
    suffix = '',
    value,
    ...remainingProps
  } = props;

  function inputChanged(value: string) {
    if (value === '') {
      onValueChange(0);
      return;
    }

    if (intRegex.test(value)) {
      onValueChange(+value);
    }
  }

  if (suffix) return (
    <SuffixTextInput
      {...remainingProps}
      suffix={suffix}
      value={value.toString()}
      onChange={action => inputChanged(action.target.value)}
    />
  );

  return (
    <TextInput
      {...remainingProps}
      value={value}
      onChange={action => inputChanged(action.target.value)}
    />
  )

}

export default QuantityInput;