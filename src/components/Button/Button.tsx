import { ButtonHTMLAttributes, FC } from 'react';
import styles from './Button.module.scss';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  text: string;
  isLoading?: boolean;
};

const Button: FC<ButtonProps> = ({ text, isLoading, ...props }) => {
  return (
    <button className={isLoading ? styles.button : styles['button-loading'] } {...props}>
      {text}
    </button>
  );
};

export default Button;