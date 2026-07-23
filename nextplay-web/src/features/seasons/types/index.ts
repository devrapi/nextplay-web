export interface Season {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  tournaments_count?: number;
  tournaments?: { id: number; name: string; slug: string }[];
  created_at: string;
  updated_at: string;
}

export interface SeasonFormData {
  name: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
}
