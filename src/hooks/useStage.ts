import { GameWithRelations } from '@/lib/types';

type Stage = 'lobby' | 'question' | 'vote' | 'results' | 'gameover';

const useStage = (game: GameWithRelations): Stage => {
  if (!game.rounds) {
    return 'lobby';
  }

  const currentRound = game.rounds[game.rounds.length - 1];

  if (game.rounds.length === 5 && currentRound.finishedAt) {
    return 'gameover';
  }

  if (currentRound.startedAt && !currentRound.votesStartedAt) {
    return 'question';
  }

  if (currentRound.votesStartedAt && !currentRound.finishedAt) {
    return 'vote';
  }

  return 'results';
};

export default useStage;
