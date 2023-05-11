import { FC } from 'react';
import classNames from 'classnames';
import { VoteOption } from '@/lib/types';
import styles from './VoteCard.module.scss';

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
  vote,
  showResults,
  votesCount,
  isCorrect,
  isSelected,
  disabled,
}) => {
  return (
    <div
      className={classNames(styles.card, {
        [styles.selected]: isSelected,
        [styles.correct]: showResults && isCorrect,
        [styles.incorrect]: showResults && !isCorrect,
      })}
    >
      <div className={styles['card-content-wrapper']}>
        { 
          option.players.map((player) => (
              <img className={styles.avatar} key={player.id} src={`/avatars/${player.avatar}`} alt="avatar-img" />
          ))
        }
        <p className={styles.answer}>{option.value}</p>
        {showResults && (
          <p className={styles.votes}>Votes: {votesCount}</p>
        )}
      </div>
    </div>
  );
};

export default VoteCard;
