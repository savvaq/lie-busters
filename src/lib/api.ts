import axios from 'axios';
import { GameWithRelations } from './types';

export const createGameApi = async (name: string) => {
  return axios.post<GameWithRelations>('/api/games/create', { name });
};

export const joinGameApi = async (code: string, name: string) => {
  return axios.post<GameWithRelations>('/api/games/join', { code, name });
};

export const startGameApi = async (gameId: number) => {
  return axios.post('/api/games/start', { id: gameId });
};

export const saveAnswerApi = async (
  gameId: number,
  roundId: number,
  value: string
) => {
  return axios.post('/api/answers/create', {
    gameId,
    roundId,
    value,
  });
};

export const startVotingApi = async (gameId: number, roundId: number) => {
  return axios.post('/api/votes/start', { gameId, roundId });
};

export const voteApi = async (
  gameId: number,
  roundId: number,
  answerId: number | null
) => {
  return axios.post('/api/votes/create', { answerId, gameId, roundId });
};

export const finishVotingApi = async (gameId: number, roundId: number) => {
  return axios.post('/api/votes/finish', { gameId, roundId });
};

export const nextRoundApi = async (gameId: number) => {
  return axios.post('/api/games/next-round', { gameId });
};
