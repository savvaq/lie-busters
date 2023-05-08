import { VoteOption } from '@/lib/types';
import { FC } from 'react';

type VoteCardProps = {
  option: VoteOption;
  vote: (answerId: number | null) => void;
};

const VoteCard: FC<VoteCardProps> = ({ option, vote }) => {
  return (
    <div>
      <button type="button" onClick={() => vote(option.id)}>
        {option.value}
      </button>
      <div>
        Answer by: {option.players.map((option) => option.name).join(', ')}
      </div>
    </div>
  );
};

export default VoteCard;
