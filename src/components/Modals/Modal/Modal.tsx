import { FC, PropsWithChildren } from 'react';
import styles from './Modal.module.scss';

type ModalProps = {
  title: string;
  isOpen: boolean;
  onClose: () => void;
};

const Modal: FC<PropsWithChildren<ModalProps>> = ({
  title,
  isOpen,
  onClose,
  children,
}) => {
  return isOpen ? (
    <>
      <div className={styles.blur} />
      <div className={styles.modal}>
        <div className={styles['close-modal-wrapper']} onClick={onClose}>
          <div className={styles['close-modal']}></div>
        </div>

        <h2>{title}</h2>

        {children}
      </div>
    </>
  ) : null;
};

export default Modal;
