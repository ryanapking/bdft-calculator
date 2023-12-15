import { Button, Modal } from 'flowbite-react';
import { useState, PropsWithChildren } from 'react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

type Props = {
  onConfirm: () => void,
  buttonText: string,
  color: string,
}

function ButtonConfirm(props: PropsWithChildren<Props>) {
  const { onConfirm, buttonText, color } = props;
  const [openModal, setOpenModal] = useState(false);

  const confirmed = () => {
    setOpenModal(false);
    onConfirm();
  };

  return (
    <>
      <Button color={color} onClick={() => setOpenModal(true)}>{buttonText}</Button>
      <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <p className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              {props.children}
            </p>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={() => confirmed()}>{buttonText}</Button>
              <Button color="gray" onClick={() => setOpenModal(false)}>Cancel</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ButtonConfirm;