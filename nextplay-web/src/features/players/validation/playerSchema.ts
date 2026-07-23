import { z } from 'zod';

export const POSITIONS = [
  'Point Guard',
  'Shooting Guard',
  'Small Forward',
  'Power Forward',
  'Center',
] as const;

export const playerSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  birth_date: z.string().optional(),
  position: z.string().optional(),
  jersey_number: z.union([z.number(), z.string(), z.null()]).optional(),
});

export type PlayerFormValues = z.infer<typeof playerSchema>;
