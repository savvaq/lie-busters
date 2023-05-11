import styles from './Timer.module.scss';

const Timer = (props) => {
    return <div className={styles.timer}>{props.timeLeft}</div>
};

export default Timer;
