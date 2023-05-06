// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { Game } from '@prisma/client';
import prisma from '@/lib/prisma';
import { ResponseError } from '@/lib/types';
import pusher from '@/lib/pusher';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Game | ResponseError>
) {
  const playerId = req.query.playerId as string;
  const gameId = req.query.gameId as string;
  const roundId = req.query.roundId as string;
  const value = req.body.value as string;

  const game = await prisma.game.findUniqueOrThrow({
    where: { id: Number(gameId) },
    include: { players: true, rounds: true },
  });

  const player = game.players.find((player) => player.id === Number(playerId));
  const round = game.rounds.find((round) => round.id === Number(roundId));

  if (!player || !round) {
    return res.status(400).json({ message: 'Invalid request' });
  }

  if (round.finishedAt) {
    return res.status(400).json({ message: 'Round already finished' });
  }

  await prisma.answer.create({
    data: {
      gameId: game.id,
      questionId: round.questionId,
      playerId: player.id,
      roundId: round.id,
      value,
    },
  });

  pusher.trigger(`game-${game.code}`, 'player-answered', player);

  res.status(200).json(game);
}
