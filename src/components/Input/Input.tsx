import { FC, InputHTMLAttributes } from 'react';
import styles from './Input.module.scss';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

const Input: FC<InputProps> = (props) => {
  return (
    <div className={styles.container}>
      <label htmlFor={props.id} className={styles.label}>
        {props.label}
      </label>
      <input className={styles.input} {...props} />
    </div>
  );
};

export default Input;
