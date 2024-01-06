import { CustomFlowbiteTheme, TextInput } from 'flowbite-react';
import { useState, ComponentProps } from 'react';

const trimDecimals = /\d*(\.?)(\d{0,3})/;
const splitRight = /(\d*?)(0*$)/;

const customTheme: CustomFlowbiteTheme['textInput'] = {
  field: {
    input: {
      withRightIcon: {
        on: 'pr-5 text-right',
      },
      colors: {
        transparent: 'bg-transparent border-transparent',
      },
    }
  },
};

type Props = Omit<ComponentProps<typeof TextInput>, 'value'> & {
  onValueChange: ( _:number ) => void,
  value: number,
  alignLeft?: boolean,
}

function InchInput(props: Props) {
  const {
    value,
    onValueChange,
    alignLeft = false,
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

  return (
    <TextInput
      {...remainingProps}
      type='text'
      value={value + trail}
      theme={customTheme}
      rightIcon={alignLeft ? undefined : () => <span className='text-gray-400'>"</span>}
      onChange={e => inputChanged(e.target.value)}
    />
  )
}

export default InchInput;