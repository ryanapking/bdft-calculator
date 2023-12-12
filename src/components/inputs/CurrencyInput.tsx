import { TextInput } from 'flowbite-react';
import { useEffect, useState, useRef } from 'react';
import { BiDollar } from 'react-icons/bi';

const currencyRegex = /^(\d*)(\.?)(\d*?)$/;

function CurrencyInput(props: { id: string, value: number, onValueChange: ( _:number ) => void }) {
  const { value, onValueChange, id } = props;

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
      id={id}
      type='text'
      icon={BiDollar} ref={ref}
      value={value.toFixed(2)}
      onChange={(action) => inputChanged(action.target)}
    />
  )
}

export default CurrencyInput;