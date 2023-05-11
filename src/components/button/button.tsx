import { ButtonHTMLAttributes, FC } from 'react';
import styles from './Button.module.scss';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  text: string;
  size: 'small' | 'big';
};

const Button: FC<ButtonProps> = ({ text, size, ...props }) => {
  // const buttonStyle = size === 'big' ? "styles['button_big']" : "styles.button";

  return (
    <button className={styles.button} {...props}>
      {text}
    </button>
  );
};

export default Button;
