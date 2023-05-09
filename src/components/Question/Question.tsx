import { FC, useCallback, useState } from 'react';
import { GameWithRelations } from '@/lib/types';
import { saveAnswerApi, startVotingApi } from '@/lib/api';
import useTimer from '../../hooks/useTimer';
import useListenToAllPlayersAnsweredEvent from './useListenToAllPlayersAnsweredEvent';

type QuestionProps = {
  game: GameWithRelations;
  isHost: boolean;
};

const Question: FC<QuestionProps> = ({ game, isHost }) => {
  const [value, setValue] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);

  const currentRound = game.rounds[game.rounds.length - 1];
  const deadtime = new Date(currentRound.startedAt);
  deadtime.setSeconds(deadtime.getSeconds() + 50); // TODO: change to 30

  const startVoting = useCallback(() => {
    if (!isHost) return;

    startVotingApi(game.id, currentRound.id);
  }, [game, currentRound, isHost]);

  const timeLeft = useTimer(deadtime, startVoting);
  useListenToAllPlayersAnsweredEvent(game, startVoting);

  const submitAnswer = () => {
    setIsSaving(true);

    saveAnswerApi(game.id, currentRound.id, value).then(() => {
      setIsSaving(false);
      setIsAnswered(true);
    });
  };

  return (
    <div>
      <p>Time left: {timeLeft}</p>
      <p>{currentRound.question.text}</p>

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
