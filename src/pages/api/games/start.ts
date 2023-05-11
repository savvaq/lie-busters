// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { Game } from '@prisma/client';
import pusher from '@/lib/pusher';
import { ResponseError } from '@/lib/types';
import { createRound, findGameById } from '@/lib/repository';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Game | ResponseError>
) {
  const gameId = req.body.gameId as number;

  const game = await findGameById(gameId);

  if (game.finishedAt) {
    return res.status(400).json({ message: 'Game already finished' });
  }

  if (game.startedAt) {
    return res.status(400).json({ message: 'Game already started' });
  }

  if (game.players.length < 2) {
    return res.status(400).json({ message: 'Not enough players' });
  }

  const round = await createRound(game, 1);

  game.rounds = [round];

  pusher.trigger(`game-${game.code}`, 'round-started', game);

  res.status(200).json(game);
}
