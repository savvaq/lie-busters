// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { Game } from '@prisma/client';
import prisma from '@/lib/prisma';
import pusher from '@/lib/pusher';
import { ResponseError } from '@/lib/types';
import randomItemFromArray from '@/helpers/randomItemFromArray';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Game | ResponseError>
) {
  const id = req.body.id as string;

  const game = await prisma.game.findFirstOrThrow({
    where: { id: Number(id) },
    orderBy: { createdAt: 'desc' },
    include: { players: true, rounds: true },
  });

  if (game.finishedAt) {
    return res.status(400).json({ message: 'Game already finished' });
  }

  if (game.startedAt) {
    return res.status(400).json({ message: 'Game already started' });
  }

  if (game.players.length < 2) {
    return res.status(400).json({ message: 'Not enough players' });
  }

  const questions = await prisma.question.findMany({
    where: { language: game.language },
  });
  const randomQuestion = randomItemFromArray(questions);

  const round = await prisma.round.create({
    data: {
      gameId: game.id,
      number: 1,
      questionId: randomQuestion.id,
    },
    include: { question: true },
  });

  game.rounds = [round];

  pusher.trigger(`game-${game.code}`, 'round-started', game);

  res.status(200).json(game);
}
