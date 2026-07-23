import { z } from 'zod';

export const gameSchema = z.object({
  division_id: z.number().min(1, 'Division is required'),
  venue_id: z.number().nullable().optional(),
  home_team_id: z.number().min(1, 'Home team is required'),
  away_team_id: z.number().min(1, 'Away team is required'),
  scheduled_at: z.string().min(1, 'Scheduled date is required'),
  status: z.enum(['scheduled', 'in_progress', 'completed', 'postponed']).optional(),
});

export type GameFormValues = z.infer<typeof gameSchema>;
