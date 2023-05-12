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
      <button type="button" onClick={vote} disabled={disabled}>
        {option.value}
      </button>

      {showResults && (
        <div>
          Answer given by:{' '}
          {option.players.map((player) => (
            <img key={player.id} src={player.avatar} />
          ))}
          <br />
          Votes received: {votesCount}
        </div>
      )}
    </div>
  );
};

export default VoteCard;
