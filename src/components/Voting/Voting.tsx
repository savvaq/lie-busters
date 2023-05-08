import { GameWithRelations } from '@/lib/types';
import { FC, useState } from 'react';
import useOptions from './useOptions';
import VoteCard from '../VoteCard/VoteCard';

type VotingProps = {
  game: GameWithRelations;
};

const Voting: FC<VotingProps> = ({ game }) => {
  const currentRound = game.rounds[game.rounds.length - 1];
  const [selectedAnswerId, setSelectedAnswerId] = useState<number | null>();
  const options = useOptions(currentRound);

  const vote = (answerId: number | null) => {
    setSelectedAnswerId(answerId);
  };

  return (
    <>
      Vote:
      <div>
        {options.map((option) => (
          <VoteCard key={option.id} option={option} vote={vote} />
        ))}
      </div>
    </>
  );
};

export default Voting;
