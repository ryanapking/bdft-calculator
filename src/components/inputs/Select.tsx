import { CustomFlowbiteTheme, Select as FlowbiteSelect } from 'flowbite-react';
import { ComponentProps } from 'react';

const customTheme: CustomFlowbiteTheme['select'] = {
  field: {
    select: {
      colors: {
        transparent: 'border-transparent',
      }
    }
  },
};

type Props = Omit<ComponentProps<typeof FlowbiteSelect>, 'theme'>

function Select(props: Props) {
  const { children, ...remainingProps} = props;
  return (
    <FlowbiteSelect {...remainingProps} theme={customTheme}>
      {children}
    </FlowbiteSelect>
  );
}

export default Select;