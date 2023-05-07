import { useEffect, useState } from 'react';
import pusher from '@/lib/pusher-client';
import { GameWithRelations } from '@/lib/types';

const useCountAnsweredPlayers = (
  game: GameWithRelations,
  onEveryoneAnswered: () => void
) => {
  const [answeredPlayers, setAnsweredPlayers] = useState(0);

  useEffect(() => {
    pusher.channel(`game-${game.code}`).bind('player-answered', () => {
      console.log('player-answered event');
      setAnsweredPlayers((answeredPlayers) => answeredPlayers + 1);
    });

    return () => {
      pusher.channel(`game-${game.code}`).unbind('player-answered');
    };
  }, [game]);

  useEffect(() => {
    if (answeredPlayers === game.players?.length) {
      console.log('onEveryoneAnswered');
      onEveryoneAnswered();
    }
  }, [answeredPlayers, game, onEveryoneAnswered]);
};

export default useCountAnsweredPlayers;
