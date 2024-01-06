const splitAtDecimal = /^(\d*)(\.?\d*)$/;

function DecimalAligned(props: { num: number, currency?: boolean }) {
  const { num, currency = false } = props;
  const numString = currency ? num.toFixed(2) : num.toString();
  console.log('numString: ', numString);
  const [ , left, right ] = splitAtDecimal.exec(numString) ?? ['', '0', ''];
  return (
    <div className='grid grid-cols-2'>
      <div className='text-right'>{currency ? '$' : ''}{currency || num >= 1 ? left : ''}</div>
      <div className='text-left'>{right ? right : '.0'}</div>
    </div>
  );
}

export default DecimalAligned;