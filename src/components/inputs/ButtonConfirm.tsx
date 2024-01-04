import { Button } from 'flowbite-react';
import { useState, PropsWithChildren, ComponentProps } from 'react';
import ModalConfirm from './ModalConfirm.tsx';

type Props = Omit<ComponentProps<typeof Button>, 'onClick'> & {
  buttonText: string,
  onConfirm?: () => void,
  excludeConfirm?: boolean,
}

function ButtonConfirm(props: PropsWithChildren<Props>) {
  const {
    buttonText,
    onConfirm = () => {},
    excludeConfirm = false,
    ...remainingProps
  } = props;
  const [openModal, setOpenModal] = useState(false);

  const confirmed = () => {
    setOpenModal(false);
    onConfirm();
  };

  return (
    <>
      <Button {...remainingProps} onClick={() => setOpenModal(true)}>{buttonText}</Button>
      <ModalConfirm
        openModal={openModal}
        onConfirm={() => confirmed()}
        onCancel={() => setOpenModal(false)}
        excludeConfirm={excludeConfirm}
        confirmText={buttonText}
      >
        {props.children}
      </ModalConfirm>
    </>
  );
}

export default ButtonConfirm;