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

  const game = await prisma.game.findFirstOrThrow({
    where: { code },
    orderBy: { createdAt: 'desc' },
    include: { players: true, rounds: true },
  });

  res.status(200).json(game);
}
