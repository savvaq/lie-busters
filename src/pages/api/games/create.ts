// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { Game } from '@prisma/client';
import { z } from 'zod';
import { setCookie } from 'cookies-next';
import { ResponseError } from '@/lib/types';
import { createGame, createPlayer } from '@/lib/repository';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Game | ResponseError>
) {
  const schema = z.object({ name: z.string().min(2).max(20) });
  const response = schema.safeParse(req.body);

  if (!response.success) {
    return res.status(400).json({ message: 'Invalid request' });
  }

  const game = await createGame();

  const avatar = Math.floor(Math.random() * 10) + '.png';
  const player = await createPlayer(game.id, response.data.name, true, avatar);

  setCookie('playerId', String(player.id), {
    res,
    req,
    maxAge: 60 * 60 * 24,
    httpOnly: true,
  });

  res.status(200).json(game);
}
