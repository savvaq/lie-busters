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
import { SubmitHandler, useForm } from 'react-hook-form';
import { AnswerSchema, AnswerSchemaType } from '@/lib/schemas';
import { zodResolver } from '@hookform/resolvers/zod';

type QuestionProps = {
  game: GameWithRelations;
  isHost: boolean;
};

const Question: FC<QuestionProps> = ({ game, isHost }) => {
  const { t } = useTranslation();
  const [isAnswered, setIsAnswered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    setError,
    formState: { errors },
  } = useForm<AnswerSchemaType>({
    resolver: zodResolver(AnswerSchema),
  });

  const currentRound = game.rounds[game.rounds.length - 1];
  const deadtime = new Date(currentRound.startedAt);
  deadtime.setSeconds(deadtime.getSeconds() + 500);

  const startVoting = useCallback(() => {
    if (!isHost) return;

    startVotingApi(game.id, currentRound.id);
  }, [game, currentRound, isHost]);

  const timeLeft = useTimer(deadtime, startVoting);
  useListenToAllPlayersAnsweredEvent(game, startVoting);

  const onSubmit: SubmitHandler<AnswerSchemaType> = ({ value }) => {
    if (isAnswered || isLoading) return;
    setIsLoading(true);

    saveAnswerApi(game.id, currentRound.id, value)
      .then(() => setIsAnswered(true))
      .catch((error) => {
        if (error.response?.data?.fieldErrors?.value) {
          setError('value', {
            type: 'manual',
            message: error.response.data.fieldErrors.value[0],
          });
        }
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <form
      className={styles['question-wrapper']}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Timer timeLeft={timeLeft} />
      <h1 className={styles.title + ' ' + sigmar.className}>
        {t('round')} {game.rounds.length}
      </h1>
      <h2 className={styles.question}>{currentRound.question.text}</h2>

      {!isAnswered ? (
        <input
          type="text"
          className={styles.input}
          placeholder={`${t('type_your_lie_here')}...`}
          {...register('value')}
        />
      ) : (
        <div className={styles.answer}>{getValues('value')}</div>
      )}
      <span>{errors?.value?.message}</span>

      {!isAnswered ? (
        <Button type="submit" text="Submit" isLoading={isLoading} />
      ) : (
        <h1 className={styles.description}>
          {t('waiting_for_other_players')}...
        </h1>
      )}
    </form>
  );
};

export default Question;
