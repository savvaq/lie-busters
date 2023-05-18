import type { NextApiRequest, NextApiResponse } from 'next';
import { Game } from '@prisma/client';
import { ResponseError } from '@/lib/types';
import pusher from '@/lib/pusher';
import { getCookie } from 'cookies-next';
import { findGameById, updateRound } from '@/lib/repository';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Game | ResponseError>
) {
  const gameId = req.body.gameId as number;
  const roundId = req.body.roundId as number;
  const playerId = getCookie('playerId', { req });

  const game = await findGameById(gameId);
  const player = game.players.find((player) => player.id === Number(playerId));
  const roundIndex = game.rounds.findIndex((round) => round.id === roundId);
  let round = game.rounds[roundIndex];

  if (player?.isHost !== true) {
    return res.status(400).json({ message: 'Invalid request' });
  }

  round = await updateRound(round.id, { votesStartedAt: new Date() });
  game.rounds[roundIndex] = round;

  await pusher.trigger(`game-${game.code}`, 'voting-started', game);

  res.status(200).json(game);
}
