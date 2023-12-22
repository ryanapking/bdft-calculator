import { Button } from 'flowbite-react';
import { useState, PropsWithChildren } from 'react';
import ModalConfirm from './ModalConfirm.tsx';

type Props = {
  buttonText: string,
  color: string,
  onConfirm?: () => void,
  excludeConfirm?: boolean,
}

function ButtonConfirm(props: PropsWithChildren<Props>) {
  const {
    buttonText,
    color,
    onConfirm = () => {},
    excludeConfirm = false
  } = props;
  const [openModal, setOpenModal] = useState(false);

  const confirmed = () => {
    setOpenModal(false);
    onConfirm();
  };

  return (
    <>
      <Button color={color} onClick={() => setOpenModal(true)}>{buttonText}</Button>
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