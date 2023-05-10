import { z } from 'zod';

export const CreateGameSchema = z.object({
  name: z.string().min(2).max(20),
});

export type CreateGameSchemaType = z.infer<typeof CreateGameSchema>;

export const JoinGameSchema = z.object({
  name: z.string().min(2).max(20),
  code: z.string().length(6),
});

export type JoinGameSchemaType = z.infer<typeof JoinGameSchema>;
