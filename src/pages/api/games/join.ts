import type { NextApiRequest, NextApiResponse } from 'next';
import { Game } from '@prisma/client';
import pusher from '@/lib/pusher';
import { ResponseError } from '@/lib/types';
import { getCookie, setCookie } from 'cookies-next';
import { createPlayer, findGameByCode } from '@/lib/repository';
import randomItemFromArray from '@/helpers/randomItemFromArray';
import { JoinGameSchema } from '@/lib/schemas';
import CustomZodError from '@/errors/CustomZodError';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Game | ResponseError>
) {
  const response = JoinGameSchema.safeParse(req.body);

  if (!response.success) {
    return res.status(422).json(response.error.flatten());
  }

  const game = await findGameByCode(response.data.code);

  if (!game) {
    const error = new CustomZodError('code', 'Game not found');
    return res.status(422).json(error.flatten());
  }

  if (game.startedAt) {
    const error = new CustomZodError('code', 'Game already started');
    return res.status(422).json(error.flatten());
  }

  const playerExists = game.players.find(
    (player) => player.id === Number(getCookie('playerId', { req }))
  );
  if (playerExists) {
    return res.status(200).json(game);
  }

  if (game.players.length >= 10) {
    const error = new CustomZodError('code', 'Game is full');
    return res.status(422).json(error.flatten());
  }

  if (game.players.some((player) => player.name === response.data.name)) {
    const error = new CustomZodError('name', 'Name already taken');
    return res.status(422).json(error.flatten());
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
