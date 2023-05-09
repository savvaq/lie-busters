import { FC } from 'react';
import { Player } from '@prisma/client';
import { GameWithRelations } from '@/lib/types';
import { startGameApi } from '@/lib/api';
import styles from './Lobby.module.css';
import { sigmar } from '../../app/fonts';
import Button from '../Button/Button';

type LobbyProps = {
  game: GameWithRelations;
  isHost: boolean;
};

const Lobby: FC<LobbyProps> = ({ game, isHost }) => {
  const startGame = () => {
    startGameApi(game.id);
  };

  return (
    <div className={styles['lobby-wrapper']}>
      <h1 className={styles.title + ' ' + sigmar.className}>Lying Game</h1>
      <h2 className={styles.description}>
        Waiting for host to start the game...
      </h2>
      <h2 className={styles['players-header'] + ' ' + sigmar.className}>
        Players
      </h2>
      <div className={styles['players-wrapper']}>
        {game.players.map((player: Player) => (
          <div key={player.id} className={styles['player-wrapper']}>
            <div className={styles['player-icon']}></div>
            <div className={styles['player-name-wrapper']}>
              <p className={styles['player-name-text']}>{player.name}</p>
            </div>
          </div>
        ))}
      </div>
      {isHost && (
        <Button
          text="Start Game"
          onclick={startGame}
          disabled={game.players.length < 2}
        />
      )}
    </div>
  );
};

export default Lobby;
