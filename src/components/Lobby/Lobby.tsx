import { FC } from 'react';
import { Player } from '@prisma/client';
import { GameWithRelations } from '@/lib/types';

type LobbyProps = {
  game: GameWithRelations;
  isHost: boolean;
  startGame: () => void;
};

const Lobby: FC<LobbyProps> = ({ game, isHost, startGame }) => {
  return (
    <div>
      <h1>Lobby</h1>
      {game.players?.map((player: Player) => {
        return <p key={player.id}>{player.name}</p>;
      })}

      {isHost && (
        <button type="button" onClick={startGame}>
          Start game
        </button>
      )}
    </div>
  );
};

export default Lobby;
