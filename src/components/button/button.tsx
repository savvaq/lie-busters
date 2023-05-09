import { FC, MouseEventHandler } from 'react';
import styles from './Button.module.scss';

type ButtonProps = {
  text: string;
  onclick: MouseEventHandler;
  disabled?: boolean;
};

const Button: FC<ButtonProps> = ({ text, onclick, disabled = false }) => {
  return (
    <button className={styles.button} onClick={onclick} disabled={disabled}>
      {text}
    </button>
  );
};

export default Button;
