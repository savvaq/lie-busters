// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { Game } from '@prisma/client';
import prisma from '@/lib/prisma';
import { ResponseError } from '@/lib/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Game | ResponseError>
) {
  const code = req.query.code as string;
  const name = req.query.name as string;

  const game = await prisma.game.findFirstOrThrow({
    where: { code },
    orderBy: { createdAt: 'desc' },
    include: { players: true },
  });

  if (game.finishedAt) {
    return res.status(400).json({ error: 'Game already finished' });
  }

  if (game.startedAt) {
    return res.status(400).json({ error: 'Game already started' });
  }

  if (game.players.length >= 10) {
    return res.status(400).json({ error: 'Game is full' });
  }

  if (game.players.some((player) => player.name === name)) {
    return res.status(400).json({ error: 'Name already taken' });
  }

  const player = await prisma.player.create({
    data: {
      name,
      gameId: game.id,
      isHost: false,
    },
  });

  game.players = [...game.players, player];

  // TODO: Send socket event that a player has joined

  res.status(200).json(game);
}