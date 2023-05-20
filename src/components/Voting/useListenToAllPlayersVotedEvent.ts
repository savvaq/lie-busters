import { useEffect } from 'react';
import { Game } from '@prisma/client';
import pusher from '@/lib/pusher-client';

const useListenToAllPlayersVotedEvent = (game: Game, listener: () => void) => {
  useEffect(() => {
    pusher.subscribe(`game-${game.code}`).bind('all-players-voted', listener);

    return () => {
      pusher.channel(`game-${game.code}`).unbind('all-players-voted', listener);
    };
  }, [game.code, listener]);
};

export default useListenToAllPlayersVotedEvent;
