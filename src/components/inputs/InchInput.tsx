import { TextInput } from 'flowbite-react';
import { useState, ComponentProps } from 'react';

const fourDecimals = /\d*\.?\d{0,4}/;
const emptyTrail = /\.?0*$/;

type Props = ComponentProps<typeof TextInput> & {
  onValueChange: ( _:number ) => void,
}

function InchInput(props: Props) {
  const { value, onValueChange, ...remainingProps } = props;
  const [ trail, setTrail ] = useState<string>('');

  function inputChanged(inputString: string) {
    let [numString] = fourDecimals.exec(inputString) ?? ['0'];
    const [trail] = emptyTrail.exec(numString) ?? [''];
    setTrail(trail);
    if (!numString.length || numString === trail) numString = '0';
    const parsed = parseFloat(numString);
    if (parsed !== value) onValueChange(parsed);
  }

  return (
    <TextInput
      {...remainingProps}
      type='text'
      value={value + trail}
      onChange={e => inputChanged(e.target.value)}
    />
  )
}

export default InchInput;