import { GameWithRelations } from '@/lib/types';
import { FC } from 'react';

type VotingProps = {
  game: GameWithRelations;
};

const Voting: FC<VotingProps> = ({ game }) => {
  const currentRound = game?.rounds?.[game?.rounds.length - 1];

  return currentRound ? (
    <div>
      Vote:
      <ul>
        {currentRound.answers.map((answer) => {
          return <li key={answer.id}>{answer.value}</li>;
        })}
      </ul>
    </div>
  ) : null;
};

export default Voting;
