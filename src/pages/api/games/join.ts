// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { Game } from '@prisma/client';
import pusher from '@/lib/pusher';
import { ResponseError } from '@/lib/types';
import { setCookie } from 'cookies-next';
import { createPlayer, findGameByCode } from '@/lib/repository';
import randomItemFromArray from '@/helpers/randomItemFromArray';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Game | ResponseError>
) {
  const schema = z.object({
    code: z.string(),
    name: z.string().min(2).max(20),
  });
  const response = schema.safeParse(req.body);

  if (!response.success) {
    return res.status(400).json({ message: 'Invalid request' });
  }

  const game = await findGameByCode(response.data.code);

  if (game.finishedAt) {
    return res.status(400).json({ message: 'Game already finished' });
  }

  if (game.startedAt) {
    return res.status(400).json({ message: 'Game already started' });
  }

  if (game.players.length >= 10) {
    return res.status(400).json({ message: 'Game is full' });
  }

  if (game.players.some((player) => player.name === response.data.name)) {
    return res.status(400).json({ message: 'Name already taken' });
  }

  const usedAvatars = game.players.map((player) => player.avatar);
  const avatars = [];

  for (let i = 1; i <= 10; i++) {
    if (!usedAvatars.includes(`${i}.png`)) {
      avatars.push(`${i}.png`);
    }
  }

  const player = await createPlayer(
    game.id,
    response.data.name,
    false,
    randomItemFromArray(avatars)
  );

  setCookie('playerId', String(player.id), {
    res,
    req,
    maxAge: 60 * 60 * 24,
    httpOnly: true,
  });

  game.players = [...game.players, player];

  pusher.trigger(`game-${game.code}`, 'player-joined', game);

  res.status(200).json(game);
}
