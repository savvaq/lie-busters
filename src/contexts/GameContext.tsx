import { GameWithRelations } from '@/lib/types';
import React from 'react';

type GameContextType = {
  game: GameWithRelations | null;
  // eslint-disable-next-line no-unused-vars
  setGame: (game: GameWithRelations) => void;
};

const GameContext = React.createContext<GameContextType>({
  game: null,
  setGame: () => undefined,
});

export default GameContext;
