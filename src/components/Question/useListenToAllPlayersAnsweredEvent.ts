import { useEffect } from 'react';
import pusher from '@/lib/pusher-client';
import { GameWithRelations } from '@/lib/types';

const useListenToAllPlayersAnsweredEvent = (
  game: GameWithRelations,
  listener: () => void
) => {
  useEffect(() => {
    pusher
      .subscribe(`game-${game.code}`)
      .bind('all-players-answered', listener);

    return () => {
      pusher.channel(`game-${game.code}`).unbind('all-players-answered');
    };
  }, [game, listener]);
};

export default useListenToAllPlayersAnsweredEvent;
