import { FC } from 'react';
import { Player } from '@prisma/client';
import { GameWithRelations } from '@/lib/types';
import { startGameApi } from '@/lib/api';
import styles from './Lobby.module.scss';
import { sigmar } from '../../app/fonts';
import Button from '../Button/Button';
import { useState } from 'react';

type LobbyProps = {
  game: GameWithRelations;
  isHost: boolean;
};

const Lobby: FC<LobbyProps> = ({ game, isHost }) => {
  const startGame = () => {
    startGameApi(game.id);
  };

  const [tooltip, setTooltip] = useState(false);

  const showTooltip = () => {
    setTooltip(true);
    setTimeout(() => {
      setTooltip(false);
    }, 2000);
  };

  return (
    <div className={styles['lobby-wrapper']}>
      <h1 className={styles.title + ' ' + sigmar.className}>Lie Busters</h1>
      <div className={styles['game-code-wrapper']}>
        <p className={styles['game-code-text']}>Game Code</p>
        <div
          onClick={() => {
            navigator.clipboard.writeText(game.code);
            showTooltip();
          }}
          className={styles['game-code-number']}
        >
          {game.code}
          {tooltip && <div className={styles['tooltip']}>Copied!</div>}
        </div>
      </div>
      <h2 className={styles['players-header'] + ' ' + sigmar.className}>
        Players
      </h2>
      <div className={styles['players-wrapper']}>
        {game.players.map((player: Player) => (
          <div key={player.id} className={styles['player-wrapper']}>
            <div className={styles['player-icon']}>
              <img src={`/avatars/${player.avatar}`} alt={player.name} />
            </div>
            <div className={styles['player-name-wrapper']}>
              <p className={styles['player-name-text']}>{player.name}</p>
            </div>
          </div>
        ))}
      </div>
      {isHost ? (
        <Button
          text="Start Game"
          onclick={startGame}
          disabled={!game.players || game.players.length < 2}
        />
      ) : (
        <h2 className={styles.description}>
          Waiting for host to start the game...
        </h2>
      )}
    </div>
  );
};

export default Lobby;
