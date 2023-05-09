import React, { FC, useState } from 'react';
import { GetServerSidePropsContext } from 'next';
import dynamic from 'next/dynamic';
import { getCookie } from 'cookies-next';
import { GameWithRelations } from '@/lib/types';
import Lobby from '@/components/Lobby/Lobby';
import useListenToPusherEvents from '@/hooks/useListenToPusherEvents';
import useStage from '@/hooks/useStage';
import { Player } from '@prisma/client';
import { findGameByCode } from '@/lib/repository';
import Scoreboard from '@/components/Scoreboard/Scoreboard';

// Need to import these dynamically to avoid timers errors
const Question = dynamic(() => import('@/components/Question/Question'), {
  ssr: false,
});
const Voting = dynamic(() => import('@/components/Voting/Voting'), {
  ssr: false,
});

type GameProps = {
  game: GameWithRelations;
  player: Player;
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const code = context.params?.code as string;
  const game = await findGameByCode(code);

  const player = game?.players?.find(
    (player) =>
      player.id === Number(getCookie('playerId', { req: context.req }))
  );

  return { props: { game: JSON.parse(JSON.stringify(game)), player } };
}

const Game: FC<GameProps> = (props) => {
  const [game, setGame] = useState<GameWithRelations>(props.game);
  const stage = useStage(game);
  const isHost = props.player.isHost;

  useListenToPusherEvents(game.code, setGame);

  switch (stage) {
    case 'lobby':
      return <Lobby game={game} isHost={isHost} />;
    case 'question':
      return <Question game={game} isHost={isHost} />;
    case 'voting':
      return <Voting game={game} currentPlayer={props.player} />;
    case 'gameover':
      return <Scoreboard game={game} />;
    default:
      return <div>Something went wrong</div>;
  }
};

export default Game;
