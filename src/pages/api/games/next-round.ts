// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { Game } from '@prisma/client';
import pusher from '@/lib/pusher';
import { ResponseError } from '@/lib/types';
import { createRound, findGameById, updateGame } from '@/lib/repository';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Game | ResponseError>
) {
  const gameId = req.body.gameId as number;

  let game = await findGameById(gameId);

  if (game.rounds.length === 2) {
    game = await updateGame(gameId, { finishedAt: new Date() });
    pusher.trigger(`game-${game.code}`, 'game-finished', game);
  } else {
    const round = await createRound(game, game.rounds.length + 1);
    game.rounds = [round];
    pusher.trigger(`game-${game.code}`, 'round-started', game);
  }

  res.status(200).json(game);
}
