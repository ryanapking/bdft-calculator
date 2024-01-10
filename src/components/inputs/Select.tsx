import { ComponentProps } from 'react';
import { RxChevronDown } from 'react-icons/rx';

const classes = {
  base: 'w-full text-transparent p-2.5 rounded-lg text-sm text-align-inherit',
  colors: {
    gray: 'bg-gray-50 border-gray-300 focus:border-cyan-500 focus:ring-cyan-500',
    transparent: 'bg-transparent border-transparent active:bg-gray-50 focus:bg-gray-50',
  },
  label: 'absolute inset-0 flex items-center pointer-events-none text-sm gap-1 p-2.5',
}

type Props = ComponentProps<'select'> & {
  label: string,
  large?: boolean,
  center?: boolean,
  transparent?: boolean,
}

function Select(props: Props) {
  const {
    children,
    label,
    large = false,
    center = false,
    transparent = false,
    className = '',
    ...remainingProps} = props;

  const selectClasses = [classes.base, classes.colors.gray];
  const labelClasses = [classes.label];

  if (transparent) {
    selectClasses.push(classes.colors.transparent);
  }
  if (center) {
    selectClasses.push('text-center');
    labelClasses.push('justify-center');
  }
  if (large) {
    selectClasses.push('leading-7');
    labelClasses.push('text-xl');
  }

  return (
    <div className={`${className} relative`}>
      <select {...remainingProps} className={selectClasses.join(' ')}>
        {children}
      </select>
      <div className={labelClasses.join(' ')}>{label}<RxChevronDown size='1rem' /></div>
    </div>

  );
}

export default Select;