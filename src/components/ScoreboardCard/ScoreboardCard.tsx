import { Player } from '@prisma/client';
import styles from './ScoreboardCard.module.scss';
import { FC } from 'react';

type ScoreboardCardProps = {
    player: Player;
    place: number;
  };

const ScoreboardCard: FC<ScoreboardCardProps> = ({ player, place }) => {

    const styleType = place === 1 ? 'winner' : 'regular';

    return (
        <>
            <div className={styles[`scoreboard-card-${styleType}`]}>
                <div className={styles[`content-wrapper-${styleType}`]}>
                    <div className={styles[`place-${styleType}`]}>{place}</div>
                    <div className={styles[`name-${styleType}`]}>{player.name}</div>
                    <div className={styles[`score-wrapper-${styleType}`]}>
                        <div className={styles[`points-score-${styleType}`]}>
                            {player.score}
                        </div>
                        <div className={styles[`points-text-${styleType}`]}>points</div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ScoreboardCard;
