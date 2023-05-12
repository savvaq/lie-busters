import randomItemFromArray from '@/helpers/randomItemFromArray';
import prisma from '@/lib/prisma';
import { Game, Player, Round } from '@prisma/client';
import { uid } from 'uid';

export const findGameByCode = async (code: string) => {
  return await prisma.game.findFirstOrThrow({
    where: { code, finishedAt: null },
    include: {
      players: true,
      rounds: {
        orderBy: { startedAt: 'asc' },
        include: {
          answers: { include: { player: true } },
          votes: true,
          question: true,
        },
      },
    },
  });
};

export const findGameById = async (id: number) => {
  return await prisma.game.findUniqueOrThrow({
    where: { id },
    include: {
      players: true,
      rounds: {
        orderBy: { startedAt: 'asc' },
        include: {
          answers: { include: { player: true } },
          votes: true,
          question: true,
        },
      },
    },
  });
};

export const findAnswerById = async (id: number) => {
  return await prisma.answer.findUniqueOrThrow({
    where: { id },
    include: { player: true },
  });
};

export const createGame = async (language: string) => {
  return prisma.game.create({
    data: { code: uid(6).toUpperCase(), language },
  });
};

export const createPlayer = async (
  gameId: number,
  name: string,
  isHost: boolean,
  avatar: string
) => {
  return prisma.player.create({
    data: { name, gameId, isHost, avatar },
  });
};

export const getRandomQuestion = async (language: string) => {
  const questions = await prisma.question.findMany({
    where: { language },
  });
  return randomItemFromArray(questions);
};

export const createRound = async (game: Game, number: number) => {
  const randomQuestion = await getRandomQuestion(game.language);

  return prisma.round.create({
    data: {
      gameId: game.id,
      number,
      questionId: randomQuestion.id,
    },
    include: {
      question: true,
      answers: { include: { player: true } },
      votes: true,
    },
  });
};

export const createAnswer = async (
  questionId: number,
  playerId: number,
  roundId: number,
  value: string
) => {
  return prisma.answer.create({
    data: {
      questionId,
      playerId,
      roundId,
      value,
    },
    include: { player: true },
  });
};

export const createVote = async (
  playerId: number,
  roundId: number,
  answerId: number | null
) => {
  return prisma.vote.create({
    data: {
      playerId,
      roundId,
      answerId,
    },
  });
};

export const updateRound = async (id: number, data: Partial<Round>) => {
  return prisma.round.update({
    where: { id },
    data,
    include: {
      question: true,
      answers: { include: { player: true } },
      votes: true,
    },
  });
};

export const updatePlayer = async (id: number, data: Partial<Player>) => {
  return prisma.player.update({
    where: { id },
    data,
  });
};

export const updateGame = async (id: number, data: Partial<Game>) => {
  return prisma.game.update({
    where: { id },
    data,
    include: {
      players: true,
      rounds: {
        orderBy: { startedAt: 'asc' },
        include: {
          answers: { include: { player: true } },
          votes: true,
          question: true,
        },
      },
    },
  });
};
