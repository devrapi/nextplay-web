import type { Season } from '../../seasons/types';

export interface Tournament {
  id: number;
  season_id: number;
  name: string;
  slug: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  season?: Season;
  divisions_count?: number;
  divisions?: { id: number; name: string; slug: string }[];
  created_at: string;
  updated_at: string;
}

export interface TournamentFormData {
  season_id: number;
  name: string;
  description?: string;
  start_date?: string;
  end_date?: string;
}
