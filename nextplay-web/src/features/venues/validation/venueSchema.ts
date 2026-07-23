import { z } from 'zod';

export const venueSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  address: z.string().optional(),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
});

export type VenueFormValues = z.infer<typeof venueSchema>;
