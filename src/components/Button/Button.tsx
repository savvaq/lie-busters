import { ButtonHTMLAttributes, FC } from 'react';
import styles from './Button.module.scss';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  text: string;
  isLoading?: boolean;
};

const Button: FC<ButtonProps> = ({ text, ...props }) => {
  return (
    <button className={styles.button} {...props}>
      {text}
    </button> 
  );
};

export default Button;