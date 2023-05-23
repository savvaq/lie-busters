import { ButtonHTMLAttributes, FC } from 'react';
import classNames from 'classnames';
import styles from './Button.module.scss';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
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
    <button
      className={classNames(styles.button, styles[size])}
      {...props}
      disabled={props.disabled || isLoading}
    >
      {isLoading ? <div className={styles.loader}></div> : text}
    </button>
  );
};

export default Button;
