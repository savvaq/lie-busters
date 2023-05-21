// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { Game } from '@prisma/client';
import { setCookie } from 'cookies-next';
import { ResponseError } from '@/lib/types';
import { createGame, createPlayer } from '@/lib/repository';
import { CreateGameSchema } from '@/lib/schemas';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Game | ResponseError>
) {
  const response = CreateGameSchema.safeParse(req.body);

  if (!response.success) {
    return res.status(422).json(response.error.flatten());
  }

  const game = await createGame(req.body.language || 'en');

  const avatar = Math.floor(Math.random() * 9) + 1 + '.png';
  const player = await createPlayer(game.id, response.data.name, true, avatar);

  setCookie('playerId', String(player.id), {
    res,
    req,
    maxAge: 60 * 60 * 24,
    httpOnly: true,
  });

  return res.status(200).json(game);
}
