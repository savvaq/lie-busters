// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const code = req.query.code as string;

  const game = await prisma.game.findFirst({
    where: {
      code,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  if (game) {
    res.status(200).json(game);
  } else {
    res.status(404).json({ error: 'Game not found' });
  }
}
