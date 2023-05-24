import { FC, PropsWithChildren } from 'react';
import styles from './Modal.module.scss';
import { motion } from "framer-motion";

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
    <div>
      <div className={styles.blur} />
      <div className={styles.modal}>
        <motion.div 
          className={styles['close-modal-wrapper']} 
          onClick={onClose}
          whileHover={{
            scale: 1.2,
            transition: { duration: 0.2 },
          }}
          whileTap={{ scale: 0.8 }}
        >
          <div className={styles['close-modal']}></div>
        </motion.div>

        <h2>{title}</h2>

        {children}
      </div>
    </div>
  ) : null;
};

export default Modal;
