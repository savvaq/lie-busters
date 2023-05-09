import type { NextApiRequest, NextApiResponse } from 'next';
import { Game } from '@prisma/client';
import { ResponseError } from '@/lib/types';
import pusher from '@/lib/pusher';
import { findGameById, updateRound } from '@/lib/repository';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Game | ResponseError>
) {
  const gameId = req.body.gameId as number;
  const roundId = req.body.roundId as number;

  const game = await findGameById(gameId);
  const roundIndex = game.rounds.findIndex((round) => round.id === roundId);
  const round = game.rounds[roundIndex];

  if (!round || round.finishedAt !== null) {
    return res.status(400).json({ message: 'Invalid request' });
  }

  game.rounds[roundIndex] = await updateRound(roundId, {
    finishedAt: new Date(),
  });

  pusher.trigger(`game-${game.code}`, 'round-finished', game);

  res.status(200).json(game);
}
