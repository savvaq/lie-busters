import { FC, useCallback, useState } from 'react';
import { GameWithRelations } from '@/lib/types';
import { saveAnswerApi, startVotingApi } from '@/lib/api';
import useTimer from '../../hooks/useTimer';
import useListenToAllPlayersAnsweredEvent from './useListenToAllPlayersAnsweredEvent';
import styles from './Question.module.css';
import { sigmar } from '@/app/fonts';
import Button from '../Button/Button';

type QuestionProps = {
  game: GameWithRelations;
  isHost: boolean;
};

const Question: FC<QuestionProps> = ({ game, isHost }) => {
  const [value, setValue] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);

  const currentRound = game.rounds[game.rounds.length - 1];
  const deadtime = new Date(currentRound.startedAt);
  deadtime.setSeconds(deadtime.getSeconds() + 25); // TODO: change to 30

  const startVoting = useCallback(() => {
    if (!isHost) return;

    startVotingApi(game.id, currentRound.id);
  }, [game, currentRound, isHost]);

  const timeLeft = useTimer(deadtime, startVoting);
  useListenToAllPlayersAnsweredEvent(game, startVoting);

  const submitAnswer = () => {
    setIsSaving(true);

    saveAnswerApi(game.id, currentRound.id, value).then(() => {
      setIsSaving(false);
      setIsAnswered(true);
    });
  };

  return (
    <>
      <div className={styles['question-wrapper']}>
        <h1 className={styles.title + ' ' + sigmar.className}>Round {game.rounds.length}</h1>
        <h2 className={styles.question}>{currentRound.question.text}</h2>

        <input
          type="text"
          value={value}
          className={styles.input}
          placeholder="Type your lie here..."
          onChange={(e) => setValue(e.target.value)}
        />

        {!isAnswered && (
          <Button
          text="Submit"
          onclick={submitAnswer}
          />
          )}
      </div>
      <div className={styles.timer}>{timeLeft}</div>
    </>
  );
};

export default Question;
