import { useEffect, useState } from 'react';

const useTimer = (deadtime: Date, onTimeOut: () => void) => {
  const now = new Date();
  const diffInSeconds = Math.floor((deadtime.getTime() - now.getTime()) / 1000);

  const [timeLeft, setTimeLeft] = useState(diffInSeconds);

  useEffect(() => {
    const timerId = setInterval(() => {
      setTimeLeft((timeLeft) => Math.max(timeLeft - 1, 0));
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft]);

  useEffect(() => {
    if (timeLeft === 0) {
      onTimeOut();
    }
  }, [timeLeft, onTimeOut]);

  return timeLeft;
};

export default useTimer;
