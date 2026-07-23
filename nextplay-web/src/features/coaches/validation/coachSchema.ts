import { z } from 'zod';

export const coachSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  bio: z.string().optional(),
});

export type CoachFormValues = z.infer<typeof coachSchema>;
