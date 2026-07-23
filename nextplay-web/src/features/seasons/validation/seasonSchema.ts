import { z } from 'zod';

export const seasonSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().min(1, 'End date is required'),
  is_active: z.boolean(),
});

export type SeasonFormValues = z.infer<typeof seasonSchema>;
