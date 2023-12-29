import { TextInput } from 'flowbite-react';
import { ComponentProps } from 'react';

const intRegex = /^\d{0,4}$/;

type Props = ComponentProps<typeof TextInput> & {
  onValueChange: ( _:number ) => void,
}

function QuantityInput(props: Props) {
  const {
    onValueChange,
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

  return (
    <TextInput
      {...remainingProps}
      type='text'
      onChange={action => inputChanged(action.target.value)}
    />
  )
}

export default QuantityInput;