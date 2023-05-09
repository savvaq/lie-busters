import type { NextApiRequest, NextApiResponse } from 'next';
import { Game, Player } from '@prisma/client';
import { ResponseError } from '@/lib/types';
import pusher from '@/lib/pusher';
import { getCookie } from 'cookies-next';
import {
  createVote,
  findAnswerById,
  findGameById,
  updatePlayer,
} from '@/lib/repository';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Game | ResponseError>
) {
  const gameId = req.body.gameId as number;
  const roundId = req.body.roundId as number;
  const answerId = req.body.answerId as number | null;
  const playerId = Number(getCookie('playerId', { req }));

  let game = await findGameById(gameId);
  const round = game.rounds.find((round) => round.id === roundId);
  const question = round?.question;
  const answer = answerId ? await findAnswerById(answerId) : null;
  const currentPlayer = game.players.find((p) => p.id === playerId) as Player;
  const playerHasVoted = round?.votes.some((v) => v.playerId === playerId);
  let score = currentPlayer.score;

  if (
    !round ||
    round.finishedAt !== null ||
    !question ||
    playerHasVoted === true
  ) {
    return res.status(400).json({ message: 'Invalid request' });
  }

  // Player voted for correct answer that no one has given
  if (answerId === null) {
    score += 2;
  }

  // Player voted for correct answer that someone has given
  if (answer?.value.toLowerCase() === question.correctAnswer.toLowerCase()) {
    score += 2;
  }

  const vote = await createVote(playerId, roundId, answerId);
  round.votes.push(vote);

  await updatePlayer(playerId, { score });

  if (answer) {
    // It's possible that few players gave same answer. We need to add a score to all of them.
    round.answers
      .filter((a) => a.value.toLowerCase() === answer.value.toLowerCase())
      .forEach(async (a) => {
        const player = game.players.find((p) => p.id === a.playerId) as Player;
        await updatePlayer(player.id, { score: player.score + 1 });
      });
  }

  // Reload game from database to get updated data
  game = await findGameById(gameId);

  if (round.votes.length === game.players.length) {
    pusher.trigger(`game-${game.code}`, 'all-players-voted', game);
  }

  res.status(200).json(game);
}
