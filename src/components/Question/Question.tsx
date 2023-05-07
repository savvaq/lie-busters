import { FC, useCallback, useState } from 'react';
import { GameWithRelations } from '@/lib/types';
import { saveAnswerApi, startVotingApi } from '@/lib/api';
import useTimer from './useTimer';
import useCountAnsweredPlayers from './useCountAnsweredPlayers';

type QuestionProps = {
  game: GameWithRelations;
  isHost: boolean;
};

const Question: FC<QuestionProps> = ({ game, isHost }) => {
  const [value, setValue] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);

  const currentRound = game?.rounds?.at(-1);

  const submitAnswer = () => {
    if (!currentRound) return;

    setIsSaving(true);

    saveAnswerApi(game.id, currentRound.id, value).then(() => {
      setIsSaving(false);
      setIsAnswered(true);
    });
  };

  const startVoting = useCallback(() => {
    if (!currentRound || !isHost) return;

    startVotingApi(game.id, currentRound.id);
  }, [game, currentRound, isHost]);

  const { timeLeft } = useTimer(startVoting);

  useCountAnsweredPlayers(game, startVoting);

  return (
    <div>
      <p>Time left: {timeLeft}</p>
      <p>{currentRound?.question.text}</p>

      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />

      {!isAnswered && (
        <button type="button" disabled={isSaving} onClick={submitAnswer}>
          Save
        </button>
      )}
    </div>
  );
};

export default Question;
