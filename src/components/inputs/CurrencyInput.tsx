import { TextInput } from 'flowbite-react';
import { useEffect, useState, useRef, ComponentProps } from 'react';
import { BiDollar } from 'react-icons/bi';

// up to 4 digits and 2 decimal places
const currencyRegex = /(\d{0,4}(?=\.|$))\.?((?<=\.)\d{0,2})?/;

type Props = Omit<ComponentProps<typeof TextInput>, 'value' | 'type'> & {
  value: number,
  onValueChange: ( _:number ) => void
}

function CurrencyInput(props: Props) {
  const {
    value,
    onValueChange,
    ...remainingProps
  } = props;

  const [cursor, setCursor] = useState<number | null>(null);
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    ref.current?.setSelectionRange(cursor, cursor);
  }, [ref, cursor, value]);

  function inputChanged(target: HTMLInputElement) {
    setCursor(target.selectionStart);
    if (target.value === '.') setCursor(2);
    const [ fullValue, left, right] = currencyRegex.exec(target.value) ?? ['0', '0', ''];
    const parsedValue = !left && !right ? 0 : +fullValue;
    onValueChange(parsedValue);
  }

  return (
    <TextInput
      {...remainingProps}
      type='text'
      ref={ref}
      icon={BiDollar}
      value={value.toFixed(2)}
      onChange={(action) => inputChanged(action.target)}
    />
  )
}

export default CurrencyInput;