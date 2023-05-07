import axios from 'axios';

export const startGameApi = async (gameId: number) => {
  return axios
    .post('/api/games/start', { id: gameId })
    .catch((err) => console.log(err.response));
};

export const saveAnswerApi = async (
  gameId: number,
  roundId: number,
  value: string
) => {
  return axios
    .post('/api/answers/create', {
      gameId,
      roundId,
      value,
    })
    .catch((err) => console.log(err.response));
};

export const startVotingApi = async (gameId: number, roundId: number) => {
  return axios
    .post('/api/votes/start', { gameId, roundId })
    .catch((err) => console.log(err.response));
};
