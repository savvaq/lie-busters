import { FC, useCallback, useState } from 'react';
import { GameWithRelations } from '@/lib/types';
import { saveAnswerApi, startVotingApi } from '@/lib/api';
import useTimer from '../../hooks/useTimer';
import useListenToAllPlayersAnsweredEvent from './useListenToAllPlayersAnsweredEvent';
import styles from './Question.module.css';
import { sigmar } from '@/app/fonts';
import Button from '../Button/Button';
import Timer from '../Timer/Timer';
import { useTranslation } from 'next-i18next';

type QuestionProps = {
  game: GameWithRelations;
  isHost: boolean;
};

const Question: FC<QuestionProps> = ({ game, isHost }) => {
  const { t } = useTranslation();
  const [value, setValue] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);

  const currentRound = game.rounds[game.rounds.length - 1];
  const deadtime = new Date(currentRound.startedAt);
  deadtime.setSeconds(deadtime.getSeconds() + 30);

  const startVoting = useCallback(() => {
    if (!isHost) return;

    startVotingApi(game.id, currentRound.id);
  }, [game, currentRound, isHost]);

  const timeLeft = useTimer(deadtime, startVoting);
  useListenToAllPlayersAnsweredEvent(game, startVoting);

  const submitAnswer = () => {
    if (isAnswered || isSaving) return;

    setIsSaving(true);

    saveAnswerApi(game.id, currentRound.id, value).then(() => {
      setIsSaving(false);
      setIsAnswered(true);
    });
  };

  return (
    <>
      <div className={styles['question-wrapper']}>
        <Timer timeLeft={timeLeft} />
        <h1 className={styles.title + ' ' + sigmar.className}>
          {t('round')} {game.rounds.length}
        </h1>
        <h2 className={styles.question}>{currentRound.question.text}</h2>

        {!isAnswered ? (
          <input
            type="text"
            value={value}
            className={styles.input}
            placeholder={`${t('type_your_lie_here')}...`}
            onChange={(e) => setValue(e.target.value)}
          />
        ) : (
          <div className={styles.answer}>{value}</div>
        )}

        {!isAnswered ? (
          <Button text="Submit" onClick={submitAnswer} />
        ) : (
          <h1 className={styles.description}>
            {t('waiting_for_other_players')}...
          </h1>
        )}
      </div>
    </>
  );
};

export default Question;
