import { FC, FormEventHandler, useCallback, useState } from 'react';
import { GameWithRelations } from '@/lib/types';
import { saveAnswerApi, startVotingApi } from '@/lib/api';
import useTimer from '../../hooks/useTimer';
import useListenToAllPlayersAnsweredEvent from './useListenToAllPlayersAnsweredEvent';
import styles from './Question.module.css';
import { sigmar } from '@/lib/fonts';
import Button from '../Button/Button';
import Timer from '../Timer/Timer';
import { useTranslation } from 'next-i18next';
import useFormErrors from '@/hooks/useFormErrors';

type QuestionProps = {
  game: GameWithRelations;
  isHost: boolean;
};

const Question: FC<QuestionProps> = ({ game, isHost }) => {
  const { t } = useTranslation();
  const { errors, setAxiosError } = useFormErrors();

  const [value, setValue] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const currentRound = game.rounds[game.rounds.length - 1];
  const deadline = new Date(currentRound.startedAt);
  deadline.setSeconds(deadline.getSeconds() + 30);

  const startVoting = useCallback(() => {
    if (!isHost) return;

    startVotingApi(game.id, currentRound.id);
  }, [game, currentRound, isHost]);

  const timeLeft = useTimer(deadline, startVoting);
  useListenToAllPlayersAnsweredEvent(game, startVoting);

  const onSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    if (isAnswered || isLoading) return;
    setIsLoading(true);

    saveAnswerApi(game.id, currentRound.id, value)
      .then(() => setIsAnswered(true))
      .catch((error) => {
        setAxiosError(error);
        setIsLoading(false);
      });
  };

  return (
    <form className={styles['question-wrapper']} onSubmit={onSubmit}>
      <Timer timeLeft={timeLeft} />

      <h1 className={styles.title + ' ' + sigmar.className}>
        {t('round')} {game.rounds.length}
      </h1>
      <h2 className={styles.question}>{currentRound.question.text}</h2>

      {isAnswered ? (
        <>
          <h1 className={styles.description}>
            {t('waiting_for_other_players')}...
          </h1>
          <div className={styles.answer}>{value}</div>
        </>
      ) : (
        <>
          <input
            type="text"
            className={styles.input}
            placeholder={`${t('type_your_lie_here')}...`}
            onChange={(e) => setValue(e.target.value)}
            maxLength={24}
            autoCapitalize="off"
            autoFocus
            required
          />
          <span>{errors.value}</span>
          <Button
            type="submit"
            size="large"
            text={t('submit')}
            isLoading={isLoading}
          />
        </>
      )}
    </form>
  );
};

export default Question;
