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

  let event;
  if (game.rounds.length === 5) {
    game = await updateGame(gameId, { finishedAt: new Date() });
    event = 'game-finished';
  } else {
    const round = await createRound(game, game.rounds.length + 1);
    game.rounds.push(round);
    event = 'round-started';
  }

  await pusher.trigger(`game-${game.code}`, event, game);

  return res.status(200).json(game);
}
