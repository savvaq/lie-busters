import React, { FC, useState } from 'react';
import { GetServerSidePropsContext } from 'next';
import axios from 'axios';
import { getCookie } from 'cookies-next';
import prisma from '@/lib/prisma';
import { GameWithRelations } from '@/lib/types';
import Lobby from '@/components/Lobby/Lobby';
import useListenToPusherEvents from '@/hooks/useListenToPusherEvents';
import useStage from '@/hooks/useStage';
import { Player } from '@prisma/client';
import Question from '@/components/Question/Question';

type GameProps = {
  game: GameWithRelations;
  player: Player;
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const code = context.params?.code as string;
  const game = await prisma.game.findFirst({
    where: { code },
    orderBy: { createdAt: 'desc' },
    include: {
      players: true,
      rounds: {
        orderBy: { startedAt: 'desc' },
        include: { question: true },
      },
    },
  });

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

  const startGame = () => {
    axios
      .post('/api/games/start', { id: game.id })
      .catch((err) => console.log(err.response));
  };

  switch (stage) {
    case 'lobby':
      return <Lobby game={game} isHost={isHost} startGame={startGame} />;
    case 'question':
      return <Question game={game} isHost={isHost} />;
    default:
      return <div>Something went wrong</div>;
  }
};

export default Game;
