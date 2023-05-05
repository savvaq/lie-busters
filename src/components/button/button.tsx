import { FC } from 'react';
import styles from './Button.module.css';

type ButtonProps = {
  text: string;
  onclick: () => void;
};

const Button: FC<ButtonProps> = (props) => {
  return (
    <button className={styles.button} onClick={props.onclick}>
      {props.text}
    </button>
  );
};

export default Button;
