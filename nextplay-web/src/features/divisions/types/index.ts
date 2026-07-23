import type { Tournament } from '../../tournaments/types';
import type { Team } from '../../teams/types';

export interface Division {
  id: number;
  tournament_id: number;
  name: string;
  slug: string;
  tournament?: Tournament;
  teams_count?: number;
  games_count?: number;
  teams?: Team[];
  created_at: string;
  updated_at: string;
}

export interface DivisionFormData {
  tournament_id: number;
  name: string;
}
