import { TextInput } from 'flowbite-react';
import { useEffect, useState, useRef } from 'react';

const isNumber = /^(\d*)(\.?)(\d*)$/;
const getTrailingZeros = /0*$/;

function InchInput(props: { id: string, value: number, onValueChange: ( _:number ) => void }) {
  const { value, onValueChange, id } = props;

  const [ trailing, setTrailing ] = useState<string>('');
  const [ cursor, setCursor ] = useState<number | null>(null);
  const ref = useRef<HTMLInputElement>(null);
  const valueString = value + trailing;

  useEffect(() => {
    ref.current?.setSelectionRange(cursor, cursor);
  }, [ref, cursor, value]);

  function inputChanged(target: HTMLInputElement) {
    console.log('inputChanged()')
    if (target.value === '') {
      onValueChange(0);
      setTrailing('');
      setCursor(1);
      return;
    }

    setCursor(target.selectionStart);

    const numberParts = isNumber.exec(target.value);
    if (!numberParts) return;

    const [ , left, decimal, right ] = numberParts;
    const trimmedRight = right.substring(0, 4);
    const foundTrailingZeros = getTrailingZeros.exec(trimmedRight);
    const trailingZeros = foundTrailingZeros ? foundTrailingZeros[0] : '';
    const trailingZerosIndex = foundTrailingZeros ? foundTrailingZeros.index : trimmedRight.length;
    const rightValue = trimmedRight.substring(0, trailingZerosIndex);

    const trailingDecimal = (decimal && !rightValue) ? '.' : '';
    setTrailing(trailingDecimal + trailingZeros);

    // deal with trailing nonsense to allow for continued typing after empty decimal or trailing zero
    if (decimal && !trimmedRight) {
      setTrailing('.');
    } else if (trailingZeros && trailingZeros.length === trimmedRight.length) {
      setTrailing('.' + trailingZeros);
    } else if (trailingZeros) {
      setTrailing(trailingZeros);
    } else {
      setTrailing('');
    }

    if (right || left) {
      const asFloat = parseFloat(left + decimal + trimmedRight);
      onValueChange(asFloat);
    }
  }

  return (
    <TextInput
      id={id}
      type='text'
      ref={ref}
      value={valueString}
      onChange={(action) => inputChanged(action.target)}
    />
  )
}

export default InchInput;