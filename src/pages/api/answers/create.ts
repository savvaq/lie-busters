import type { NextApiRequest, NextApiResponse } from 'next';
import { Game } from '@prisma/client';
import { ResponseError } from '@/lib/types';
import pusher from '@/lib/pusher';
import { getCookie } from 'cookies-next';
import { createAnswer, findGameById } from '@/lib/repository';
import { ZodError } from 'zod';
import { i18n } from 'next-i18next';
import config from '@/config.json';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Game | ResponseError>
) {
  const gameId = req.body.gameId as number;
  const roundId = req.body.roundId as number;
  const value = (req.body.value as string).trim();
  const playerId = getCookie('playerId', { req });

  const game = await findGameById(gameId);

  const player = game.players.find((player) => player.id === Number(playerId));
  const round = game.rounds.find((round) => round.id === roundId);

  if (!player || !round) {
    return res.status(400).json({ message: 'Invalid request' });
  }

  const secondsPassed = (Date.now() - round.startedAt.getTime()) / 1000;

  if (
    round.votesStartedAt ||
    round.finishedAt ||
    secondsPassed >= config.timeToAnswer + 5
  ) {
    const error = new ZodError([
      {
        path: ['value'],
        message: i18n?.t('too_late', { ns: 'custom' }) ?? 'Too late',
        code: 'custom',
      },
    ]);
    return res.status(422).json(error.flatten());
  }

  const correctAnswer = round.question.correctAnswer.toLowerCase();

  if (value.toLowerCase() === correctAnswer) {
    const error = new ZodError([
      {
        path: ['value'],
        message:
          i18n?.t('correct_answer_given', { ns: 'custom' }) ??
          "You've guessed the correct answer! Now come up with a lie.",
        code: 'custom',
      },
    ]);
    return res.status(422).json(error.flatten());
  }

  const answer = await createAnswer(
    round.questionId,
    player.id,
    round.id,
    value
  );

  round.answers.push(answer);

  if (round.answers.length === game.players.length) {
    await pusher.trigger(`game-${game.code}`, 'all-players-answered', game);
  }

  res.status(200).json(game);
}
