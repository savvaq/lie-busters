import { FC } from 'react';
import classNames from 'classnames';
import { VoteOption } from '@/lib/types';
import styles from './VoteCard.module.scss';
import { useTranslation } from 'next-i18next';

type VoteCardProps = {
  option: VoteOption;
  vote: () => void;
  showResults: boolean;
  votesCount: number;
  isCorrect: boolean;
  isSelected: boolean;
  disabled: boolean;
};

const VoteCard: FC<VoteCardProps> = ({
  option,
  showResults,
  votesCount,
  isCorrect,
  isSelected,
  vote,
}) => {
  const { t } = useTranslation();

  return (
    <div
      className={classNames(styles.card, {
        [styles.selected]: isSelected,
        [styles.correct]: showResults && isCorrect,
        [styles.incorrect]: showResults && !isCorrect,
        [styles.inactive]: showResults,
      })}
    >
      <div className={styles['card-content-wrapper']} onClick={vote}>
        {showResults &&
          option.players.map((player) => (
            <img
              className={styles.avatar}
              key={player.id}
              src={`/avatars/${player.avatar}`}
              alt="avatar-img"
            />
          ))}
        <p className={styles.answer}>{option.value}</p>
        {showResults && (
          <p className={styles.votes}>
            {t('votes')}: {votesCount}
          </p>
        )}
      </div>
    </div>
  );
};

export default VoteCard;
