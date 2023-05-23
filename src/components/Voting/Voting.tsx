import { GameWithRelations, VoteOption } from '@/lib/types';
import { FC, useCallback, useState } from 'react';
import useOptions from './useOptions';
import VoteCard from '../VoteCard/VoteCard';
import useTimer from '@/hooks/useTimer';
import { finishVotingApi, nextRoundApi, voteApi } from '@/lib/api';
import useListenToAllPlayersVotedEvent from './useListenToAllPlayersVotedEvent';
import Button from '../Button/Button';
import { Player } from '@prisma/client';
import styles from './Voting.module.scss';
import { sigmar } from '@/lib/fonts';
import Timer from '../Timer/Timer';
import { useTranslation } from 'next-i18next';

type VotingProps = {
  game: GameWithRelations;
  currentPlayer: Player;
};

const Voting: FC<VotingProps> = ({ game, currentPlayer }) => {
  const { t } = useTranslation();

  const currentRound = game.rounds[game.rounds.length - 1];
  const question = currentRound.question;
  const deadline = new Date(currentRound.votesStartedAt ?? Date.now());
  deadline.setSeconds(deadline.getSeconds() + 30); // TODO: change to 15

  const finishVoting = useCallback(() => {
    if (!currentPlayer.isHost || currentRound.finishedAt !== null) return;

    finishVotingApi(game.id, currentRound.id);
  }, [game, currentRound, currentPlayer]);

  const nextRound = () => {
    nextRoundApi(game.id);
  };

  const [selectedAnswerId, setSelectedAnswerId] = useState<number | null>();
  const options = useOptions(currentRound);
  const timeLeft = useTimer(deadline, finishVoting);
  useListenToAllPlayersVotedEvent(game, finishVoting);

  const votesCountForOption = (optionId: number | null) => {
    return currentRound.votes.filter((vote) => vote.answerId === optionId)
      .length;
  };

  const optionIsDisabled = (option: VoteOption) => {
    return option.players.some((player) => player.id === currentPlayer.id);
  };

  const vote = (answerId: number | null) => {
    if (selectedAnswerId) return;

    setSelectedAnswerId(answerId);
    voteApi(game.id, currentRound.id, answerId);
  };

  return (
    <>
      <div className={styles['voting-wrapper']}>
        {(currentRound.finishedAt !== null || selectedAnswerId !== null) && (
          <Timer timeLeft={timeLeft} />
        )}

        <h1 className={styles.title + ' ' + sigmar.className}>
          {t('round')} {game.rounds.length}
        </h1>

        <h2 className={styles.question}>{currentRound.question.text}</h2>
        <div className={styles['answers-block-wrapper']}>
          <p className={styles['sub-header']}>
            {currentRound.finishedAt !== null
              ? `${t('results')}:`
              : `${t('choose_the_correct_answer')}`}
          </p>
          <div className={styles['answers-wrapper']}>
            {options.map((option) => (
              <VoteCard
                key={option.id}
                option={option}
                vote={() => vote(option.id)}
                showResults={currentRound.finishedAt !== null}
                votesCount={votesCountForOption(option.id)}
                isCorrect={
                  option.value.toLowerCase() ===
                  question.correctAnswer.toLowerCase()
                }
                isSelected={option.id === selectedAnswerId}
                disabled={optionIsDisabled(option)}
              />
            ))}
          </div>
        </div>
        {currentRound.finishedAt && currentPlayer.isHost && (
          <Button
            onClick={nextRound}
            size="large"
            text={
              game.rounds.length === 5 ? t('show_results') : t('next_round')
            }
          />
        )}
      </div>
    </>
  );
};

export default Voting;
