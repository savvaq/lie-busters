// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { Game } from '@prisma/client';
import { uid } from 'uid';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { ResponseError } from '@/lib/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Game | ResponseError>
) {
  const schema = z.object({ name: z.string().min(2).max(20) });
  const response = schema.safeParse(req.body);

  if (!response.success) {
    return res.status(400).json({ message: 'Invalid request' });
  }

  const game = await prisma.game.create({
    data: { code: uid(6).toUpperCase() },
    include: { players: true },
  });

  const player = await prisma.player.create({
    data: {
      name: response.data.name,
      gameId: game.id,
      isHost: true,
    },
  });

  game.players = [player];

  res.status(200).json(game);
}
