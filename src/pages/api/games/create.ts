// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { Game } from '@prisma/client';
import { uid } from 'uid';
import prisma from '../../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Game>
) {
  const game = await prisma.game.create({
    data: {
      code: uid(6).toUpperCase(),
    },
  });

  res.status(200).json(game);
}
