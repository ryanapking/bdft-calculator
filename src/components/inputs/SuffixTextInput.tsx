import { ComponentProps } from 'react';

const classes = {
  inputBase: 'w-full text-transparent caret-black p-2.5 rounded-lg text-sm',
  colors: {
    gray: 'bg-gray-50 border-gray-300 focus:border-cyan-500 focus:ring-cyan-500',
    transparent: 'bg-transparent border-transparent active:bg-gray-50 focus:bg-gray-50',
  },
  align: {
    center: 'text-center',
  },
  shadowAlign: {
    center: 'justify-center'
  }
};

type Props = ComponentProps<'input'> & {
  suffix: string,
  center?: boolean,
  transparent?: boolean,
  value: string,
}

function SuffixTextInput(props: Props) {
  const {
    suffix,
    center = false,
    transparent = false,
    value,
    ...remainingProps
  } = props;

  let shadowAlign;
  const inputClasses = [classes.inputBase, classes.colors.gray];
  if (transparent) inputClasses.push(classes.colors.transparent);

  if (center) {
    inputClasses.push(classes.align.center);
    shadowAlign = classes.shadowAlign.center;
  }

  return (
    <div className='relative'>
      <input
        type='text'
        value={value}
        {...remainingProps}
        className={inputClasses.join(' ')}
      />
      <div className={`absolute flex inset-0 pointer-events-none text-sm p-2.5 border border-transparent ${shadowAlign}`}>
        <span>
          {value}
          <span className='absolute text-gray-400 pl-0.5'>{suffix}</span>
        </span>
      </div>
    </div>
  )
}

export default SuffixTextInput;