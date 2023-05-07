import { GameWithRelations } from '@/lib/types';

type Stage = 'lobby' | 'question' | 'voting' | 'results' | 'gameover';

const useStage = (game: GameWithRelations): Stage => {
  if (!game.rounds || game.rounds.length === 0) {
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
    return 'voting';
  }

  return 'results';
};

export default useStage;
