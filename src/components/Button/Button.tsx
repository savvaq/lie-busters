import { ButtonHTMLAttributes, FC } from 'react';
import styles from './Button.module.scss';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  text: string;
  isLoading?: boolean;
};

const Button: FC<ButtonProps> = ({ text, isLoading, ...props }) => {
  return (
    <button
      className={styles.button}
      {...props}
      disabled={props.disabled || isLoading}
    >
      {isLoading ? <div className={styles.loader}></div> : text}
    </button>
  );
};

export default Button;
