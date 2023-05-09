import { GameWithRelations, VoteOption } from '@/lib/types';
import { FC, useCallback, useState } from 'react';
import useOptions from './useOptions';
import VoteCard from '../VoteCard/VoteCard';
import useTimer from '@/hooks/useTimer';
import { finishVotingApi, nextRoundApi, voteApi } from '@/lib/api';
import useListenToAllPlayersVotedEvent from './useListenToAllPlayersVotedEvent';
import Button from '../Button/Button';
import { Player } from '@prisma/client';

type VotingProps = {
  game: GameWithRelations;
  currentPlayer: Player;
};

const Voting: FC<VotingProps> = ({ game, currentPlayer }) => {
  const currentRound = game.rounds[game.rounds.length - 1];
  const question = currentRound.question;
  const deadtime = new Date(currentRound.votesStartedAt ?? Date.now());
  deadtime.setSeconds(deadtime.getSeconds() + 30); // TODO: change to 15

  const finishVoting = useCallback(() => {
    if (!currentPlayer.isHost || currentRound.finishedAt !== null) return;

    finishVotingApi(game.id, currentRound.id);
  }, [game, currentRound, currentPlayer]);

  const nextRound = () => {
    nextRoundApi(game.id);
  };

  const [selectedAnswerId, setSelectedAnswerId] = useState<number | null>();
  const options = useOptions(currentRound);
  const timeLeft = useTimer(deadtime, finishVoting);
  useListenToAllPlayersVotedEvent(game, finishVoting);

  const votesCountForOption = (optionId: number | null) => {
    return currentRound.votes.filter((vote) => vote.answerId === optionId)
      .length;
  };

  const optionIsDisabled = (option: VoteOption) => {
    return (
      currentRound.finishedAt !== null ||
      selectedAnswerId !== undefined ||
      option.players.some((player) => player.id === currentPlayer.id)
    );
  };

  const vote = (answerId: number | null) => {
    setSelectedAnswerId(answerId);
    voteApi(game.id, currentRound.id, answerId);
  };

  return (
    <>
      {!currentRound.finishedAt && <p>Time left: {timeLeft}</p>}
      Vote:
      <div>
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
      {currentRound.finishedAt && currentPlayer.isHost && (
        <Button
          onclick={nextRound}
          text={game.rounds.length === 2 ? 'Show results' : 'Next round'}
        />
      )}
    </>
  );
};

export default Voting;
