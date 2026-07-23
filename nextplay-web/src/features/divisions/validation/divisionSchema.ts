import { z } from 'zod';

export const divisionSchema = z.object({
  tournament_id: z.number().min(1, 'Tournament is required'),
  name: z.string().min(1, 'Name is required'),
});

export type DivisionFormValues = z.infer<typeof divisionSchema>;
