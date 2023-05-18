import type { NextApiRequest, NextApiResponse } from 'next';
import { ZodError, ZodIssueCode } from 'zod';
import { Game } from '@prisma/client';
import pusher from '@/lib/pusher';
import { ResponseError } from '@/lib/types';
import { getCookie, setCookie } from 'cookies-next';
import { createPlayer, findGameByCode } from '@/lib/repository';
import randomItemFromArray from '@/helpers/randomItemFromArray';
import { JoinGameSchema } from '@/lib/schemas';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Game | ResponseError>
) {
  const response = JoinGameSchema.safeParse(req.body);

  if (!response.success) {
    return res
      .status(400)
      .json({ message: 'Invalid request', ...response.error.flatten() });
  }

  const game = await findGameByCode(response.data.code);

  if (game.startedAt) {
    return res.status(400).json({ message: 'Game already started' });
  }

  const playerExists = game.players.find(
    (player) => player.id === Number(getCookie('playerId', { req }))
  );
  if (playerExists) {
    return res.status(200).json(game);
  }

  if (game.players.length >= 10) {
    return res.status(400).json({ message: 'Game is full' });
  }

  if (game.players.some((player) => player.name === response.data.name)) {
    const error = new ZodError([
      {
        code: ZodIssueCode.custom,
        path: ['name'],
        message: 'Name already taken',
      },
    ]);

    return res
      .status(400)
      .json({ message: 'Invalid request', ...error.flatten() });
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

  await pusher.trigger(`game-${game.code}`, 'player-joined', game);

  res.status(200).json(game);
}
