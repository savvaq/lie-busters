import styles from './Timer.module.scss';
import { FC } from 'react';

type TimerProps = {
    timeLeft: number;
  };

const Timer: FC<TimerProps> = ({ timeLeft }) => {
    return <div className={styles.timer}>{timeLeft}</div>
};

export default Timer;
