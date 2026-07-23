import { z } from 'zod';

export const tournamentSchema = z.object({
  season_id: z.number().min(1, 'Season is required'),
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
});

export type TournamentFormValues = z.infer<typeof tournamentSchema>;
