import { FC } from 'react';
import classNames from 'classnames';
import styles from './Button.module.scss';
import { motion } from 'framer-motion';

type ButtonProps = HTMLMotionProps<'button'> & {
  text: string;
  isLoading?: boolean;
  size?: 'small' | 'medium' | 'large';
};

const Button: FC<ButtonProps> = ({
  text,
  isLoading,
  size = 'medium',
  ...props
}) => {
  return (
    <motion.button
      whileHover={{
        scale: 1.1,
        transition: { duration: 0.2 },
      }}
      whileTap={{ scale: 0.9 }}
      className={classNames(styles.button, styles[size])}
      {...props}
      disabled={props.disabled || isLoading}
    >
      {isLoading ? <div className={styles.loader}></div> : text}
    </motion.button>
  );
};

export default Button;
