import { useEffect } from 'react';
import pusher from '@/lib/pusher-client';
import { GameWithRelations } from '@/lib/types';

const useListenToPusherEvents = (
  code: string,
  setGame: (game: GameWithRelations) => void
) => {
  useEffect(() => {
    pusher
      .subscribe(`game-${code}`)
      .bind('player-joined', (data: GameWithRelations) => setGame(data))
      .bind('round-started', (data: GameWithRelations) => setGame(data))
      .bind('voting-started', (data: GameWithRelations) => setGame(data));
  }, [code, setGame]);
};

export default useListenToPusherEvents;
