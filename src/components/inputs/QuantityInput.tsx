import { TextInput } from 'flowbite-react';

const intRegex = /^\d{0,4}$/;

function QuantityInput(props: { id: string, value: number, onValueChange: ( _:number ) => void }) {
  const { value, onValueChange, id } = props;

  function inputChanged(value: string) {
    if (value === '') {
      onValueChange(0);
      return;
    }

    if (intRegex.test(value)) {
      onValueChange(parseInt(value));
    }
  }

  return (
    <TextInput
      id={id}
      type='text'
      value={value}
      onChange={(action) => inputChanged(action.target.value)}
    />
  )
}

export default QuantityInput;