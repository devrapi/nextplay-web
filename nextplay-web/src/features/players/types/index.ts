export interface Player {
  id: number;
  first_name: string;
  last_name: string;
  birth_date: string | null;
  photo_path: string | null;
  position?: string | null;
  jersey_number?: number | null;
  created_at: string;
  updated_at: string;
}

export interface PlayerFormData {
  first_name: string;
  last_name: string;
  birth_date?: string;
  position?: string;
  jersey_number?: number | null;
}
