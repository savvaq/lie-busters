import { z } from 'zod';
import { findGameByCode } from './repository';

export const CreateGameSchema = z.object({
  name: z.string().min(2).max(20),
});

export type CreateGameSchemaType = z.infer<typeof CreateGameSchema>;

export const JoinGameSchema = z
  .object({
    name: z.string().min(2).max(20),
    code: z
      .string()
      .length(6)
      .refine(
        async (code) => {
          const game = await findGameByCode(code);
          return game !== null && !game.startedAt && game.players.length < 10;
        },
        { params: { i18n: { key: 'cant_join_game' } } }
      ),
  })
  .refine(
    async (values) => {
      const game = await findGameByCode(values.code);
      return (
        game === null ||
        game.players.every((player) => player.name !== values.name)
      );
    },
    { params: { i18n: { key: 'name_already_taken' } }, path: ['name'] }
  );

export type JoinGameSchemaType = z.infer<typeof JoinGameSchema>;

export const AnswerSchema = z.object({
  value: z.string().min(1).max(24),
});

export type AnswerSchemaType = z.infer<typeof AnswerSchema>;
