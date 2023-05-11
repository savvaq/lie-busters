import type { NextApiRequest, NextApiResponse } from 'next';
import { Game } from '@prisma/client';
import { ResponseError } from '@/lib/types';
import pusher from '@/lib/pusher';
import { getCookie } from 'cookies-next';
import { createAnswer, findGameById } from '@/lib/repository';

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

  if (round.votesStartedAt || round.finishedAt || secondsPassed >= 35) {
    return res.status(400).json({ message: 'Too late' });
  }

  const answer = await createAnswer(
    round.questionId,
    player.id,
    round.id,
    value
  );

  round.answers.push(answer);

  if (round.answers.length === game.players.length) {
    pusher.trigger(`game-${game.code}`, 'all-players-answered', game);
  }

  res.status(200).json(game);
}
