import { TextInput } from 'flowbite-react';
import { useEffect, useState, useRef, ComponentProps } from 'react';
import { BiDollar } from 'react-icons/bi';

const currencyRegex = /^(\d*)(\.?)(\d*?)$/;

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
    if (currencyRegex.test(target.value)) {
      const asFloat = parseFloat(target.value);
      const asTwoDecimalFloat = parseFloat(asFloat.toFixed(2));
      onValueChange(asTwoDecimalFloat);
    }
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