import { FC } from 'react';
import { GameWithRelations } from '@/lib/types';
import ScoreboardCard from '../ScoreboardCard/ScoreboardCard';
import styles from './Scoreboard.module.scss';
import { sigmar } from '../../lib/fonts';
import Button from '../Button/Button';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';

type ScoreboardProps = {
  game: GameWithRelations;
};

const Scoreboard: FC<ScoreboardProps> = ({ game }) => {
  const { t } = useTranslation();

  return (
    <div className={styles['scoreboard-wrapper']}>
      <h1 className={styles.title + ' ' + sigmar.className}>
        {t('final_results')}
      </h1>

      <div className={styles['scorecard-results-wrapper']}>
        <img src="/img/crown.png" alt="Logo" className={styles.img} />
        {game.players
          .sort((a, b) => b.score - a.score)
          .map((player, i) => (
            <div key={player.id} className={styles['scorecard-results-item']}>
              <ScoreboardCard player={player} place={i + 1} />
            </div>
          ))}
      </div>
      <div className={styles['play-again-button']}>
        <Link href="/">
          <Button size="large" text={t('play_again')} />
        </Link>
      </div>
    </div>
  );
};

export default Scoreboard;
