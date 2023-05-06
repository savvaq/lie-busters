import { GameWithRelations } from '@/lib/types';
import { FC } from 'react';

type QuestionProps = {
  game: GameWithRelations;
  isHost: boolean;
};

const Question: FC<QuestionProps> = ({ game }) => {
  if (!game.rounds) return null;

  const question = game.rounds[game.rounds.length - 1].question;

  return <div>{question.text}</div>;
};

export default Question;
