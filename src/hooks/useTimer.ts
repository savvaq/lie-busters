import { useEffect, useState } from 'react';

const tickingSound = new Audio('/sounds/ticking.mp3');
tickingSound.volume = 0.7;

const useTimer = (deadline: Date, onTimeOut: () => void) => {
  const now = new Date();
  const diffInSeconds = Math.floor((deadline.getTime() - now.getTime()) / 1000);

  const [timerId, setTimerId] = useState<NodeJS.Timer | null>(null);
  const [timeLeft, setTimeLeft] = useState(diffInSeconds);

  useEffect(() => {
    const timerId = setInterval(() => {
      setTimeLeft((timeLeft) => Math.max(timeLeft - 1, 0));
    }, 1000);
    setTimerId(timerId);
    tickingSound.play();

    return () => {
      clearInterval(timerId);
      tickingSound.pause();
    };
  }, []);

  useEffect(() => {
    if (timeLeft === 0) {
      tickingSound.pause();
      onTimeOut();
    }
  }, [timeLeft, onTimeOut]);

  return {
    timeLeft,
    stopTimer: () => {
      timerId !== null && clearInterval(timerId);
      tickingSound.pause();
    },
  };
};

export default useTimer;
