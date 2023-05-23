import { FC } from 'react';
import { GameWithRelations } from '@/lib/types';
import { startGameApi } from '@/lib/api';
import styles from './Lobby.module.scss';
import { sigmar } from '../../lib/fonts';
import Button from '@/components/Button/Button';
import { useState } from 'react';
import { useTranslation } from 'next-i18next';

type LobbyProps = {
  game: GameWithRelations;
  isHost: boolean;
};

const Lobby: FC<LobbyProps> = ({ game, isHost }) => {
  const { t } = useTranslation();
  const [tooltip, setTooltip] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const startGame = () => {
    setIsLoading(true);
    startGameApi(game.id);
  };

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
        <p className={styles['game-code-text']}>{t('game_code')}</p>
        <div
          onClick={() => {
            navigator.clipboard.writeText(game.code);
            showTooltip();
          }}
          className={styles['game-code-number']}
        >
          {game.code}
          {tooltip && <div className={styles['tooltip']}>{t('copied')}!</div>}
        </div>
      </div>
      <h2 className={styles['players-header'] + ' ' + sigmar.className}>
        {t('players')}
      </h2>
      <div className={styles['players-wrapper']}>
        {game.players.map((player) => (
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
          text={t('start_game')}
          size="large"
          onClick={startGame}
          isLoading={isLoading}
          disabled={game.players.length < 2}
        />
      ) : (
        <h2 className={styles.description}>
          {t('waiting_for_host_to_start_game')}
        </h2>
      )}
    </div>
  );
};

export default Lobby;
