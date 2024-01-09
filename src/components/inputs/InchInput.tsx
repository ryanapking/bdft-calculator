import { useState, ComponentProps } from 'react';
import SuffixTextInput from './SuffixTextInput.tsx';

const trimDecimals = /\d*(\.?)(\d{0,3})/;
const splitRight = /(\d*?)(0*$)/;

type Props = Omit<ComponentProps<typeof SuffixTextInput>, 'value' | 'suffix'> & {
  onValueChange: ( _:number ) => void,
  value: number,
}

function InchInput(props: Props) {
  const {
    value,
    onValueChange,
    ...remainingProps
  } = props;
  const [ trail, setTrail ] = useState<string>('');

  function inputChanged(inputString: string) {
    const [ trimmedVal, decimal, trimmedRight ] = trimDecimals.exec(inputString) ?? ['0', '', ''];
    const [ , rightVal, rightZeros ] = splitRight.exec(trimmedRight) ?? ['', '', ''];
    const trail = rightVal ? rightZeros : decimal + rightZeros;
    setTrail(trail);
    let numString = trimmedVal;
    if (!numString.length || numString === trail) numString = '0';
    const parsed = parseFloat(numString);
    if (parsed !== value) onValueChange(parsed);
  }

  return <SuffixTextInput
    {...remainingProps}
    suffix='"'
    value={value + trail}
    onChange={e => inputChanged(e.target.value)}
  />
}

export default InchInput;