import { Game, Player, Question, Round } from '@prisma/client';

export type ResponseError = {
  message: string;
};

export type RoundWithRelations = Round & {
  question: Question;
};

export type GameWithRelations = Game & {
  players?: Player[];
  rounds?: RoundWithRelations[];
};
