import type { Division } from '../../divisions/types';
import type { Venue } from '../../venues/types';
import type { Team } from '../../teams/types';
import type { Player } from '../../players/types';

export interface Game {
  id: number;
  division_id: number;
  venue_id: number | null;
  home_team_id: number;
  away_team_id: number;
  scheduled_at: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'postponed';
  home_score: number | null;
  away_score: number | null;
  mvp_player_id: number | null;
  division?: Division;
  venue?: Venue | null;
  home_team?: Team;
  away_team?: Team;
  mvp?: Player | null;
  periods_count?: number;
  created_at: string;
  updated_at: string;
}

export interface GameFormData {
  division_id: number;
  venue_id?: number | null;
  home_team_id: number;
  away_team_id: number;
  scheduled_at: string;
  status?: 'scheduled' | 'in_progress' | 'completed' | 'postponed';
}
