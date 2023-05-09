import { GameWithRelations } from '@/lib/types';
import { FC } from 'react';

type ScoreboardProps = {
  game: GameWithRelations;
};

const Scoreboard: FC<ScoreboardProps> = ({ game }) => {
  return (
    <div>
      <ul>
        {game.players
          .sort((a, b) => b.score - a.score)
          .map((player, i) => (
            <li key={player.id}>
              {player.name} {player.score} {i === 0 && '👑'}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Scoreboard;
