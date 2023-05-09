import { GameWithRelations } from '@/lib/types';

type Stage = 'lobby' | 'question' | 'voting' | 'gameover';

const useStage = (game: GameWithRelations): Stage => {
  if (game.rounds.length === 0) {
    return 'lobby';
  }

  if (game.finishedAt !== null) {
    return 'gameover';
  }

  const currentRound = game.rounds[game.rounds.length - 1];

  if (currentRound.startedAt && !currentRound.votesStartedAt) {
    return 'question';
  }

  return 'voting';
};

export default useStage;
