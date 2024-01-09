import { ComponentProps, ForwardedRef, forwardRef } from 'react';

const classes = {
  base: 'w-full text-gray-900 caret-black p-2.5 rounded-lg text-sm text-align-inherit',
  colors: {
    gray: 'bg-gray-50 border-gray-300 focus:border-cyan-500 focus:ring-cyan-500',
    transparent: 'bg-transparent border-transparent active:bg-gray-50 focus:bg-gray-50',
  },
}

type Props = Omit<ComponentProps<'input'>, 'type'> & {
  transparent?: boolean,
  center?: boolean,
}

const TextInput = forwardRef((props: Props, ref: ForwardedRef<HTMLInputElement>) => {
  const {
    transparent = false,
    center = false,
    className,
    ...remainingProps
  } = props;

  const inputClasses = [classes.base, classes.colors.gray];
  if (transparent) inputClasses.push(classes.colors.transparent);
  if (className) inputClasses.push(className);
  if (center) inputClasses.push('text-center');

  return (
    <input type="text" ref={ref} {...remainingProps} className={inputClasses.join(' ')}/>
  );
});





export default TextInput;