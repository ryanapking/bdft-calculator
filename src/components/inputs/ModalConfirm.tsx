import { Button, Modal } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { PropsWithChildren } from 'react';

type Props = {
  openModal: boolean,
  onCancel: () => void,
  onConfirm?: () => void,
  excludeConfirm?: boolean,
  cancelText?: string,
  confirmText?: string,
}

function ModalConfirm(props: PropsWithChildren<Props>) {
  const {
    children,
    openModal,
    onCancel,
    onConfirm = () => {},
    cancelText = 'Cancel',
    confirmText = 'Confirm',
    excludeConfirm = false,
  } = props;

  return (
    <Modal show={openModal} size="md" onClose={() => onCancel()} popup>
      <Modal.Header />
      <Modal.Body>
        <div className="text-center">
          <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
          <p className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
            {children}
          </p>
          <div className="flex justify-center gap-4">
            {excludeConfirm ? null : <Button color="failure" onClick={() => onConfirm()}>{confirmText}</Button>}
            <Button color="gray" onClick={() => onCancel()}>{cancelText}</Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default ModalConfirm;