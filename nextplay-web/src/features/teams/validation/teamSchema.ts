import { z } from 'zod';

export const teamSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export type TeamFormValues = z.infer<typeof teamSchema>;
