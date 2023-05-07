import { useEffect, useState } from 'react';

const useTimer = (onTimeOut: () => void) => {
  const [timeLeft, setTimeLeft] = useState(30);
  const [timer, setTimer] = useState<NodeJS.Timer | null>(null);

  useEffect(() => {
    const timerId = setInterval(() => {
      setTimeLeft((timeLeft) => timeLeft - 1);
    }, 1000);

    setTimer(timerId);

    return () => clearInterval(timerId);
  }, []);

  useEffect(() => {
    if (timeLeft === 0) {
      onTimeOut();
      timer && clearInterval(timer);
    }
  }, [timeLeft, timer, onTimeOut]);

  return { timeLeft };
};

export default useTimer;
