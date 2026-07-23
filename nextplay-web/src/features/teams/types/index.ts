import type { Coach } from '../../coaches/types';

export interface Team {
  id: number;
  name: string;
  slug: string;
  logo_path: string | null;
  description: string | null;
  coach_id: number | null;
  coach?: Coach;
  division?: { id: number; name: string } | null;
  team_players_count?: number;
  team_players?: TeamPlayer[];
  created_at: string;
  updated_at: string;
}

export interface TeamPlayer {
  id: number;
  first_name: string;
  last_name: string;
  full_name?: string;
  photo_path: string | null;
  position?: string | null;
  jersey_number?: number | null;
  birth_date?: string | null;
  pivot?: {
    team_id: number;
    player_id: number;
  };
}

export interface TeamFormData {
  name: string;
  description?: string;
}
