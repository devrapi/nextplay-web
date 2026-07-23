export interface Coach {
  id: number;
  first_name: string;
  last_name: string;
  photo_path: string | null;
  bio: string | null;
  teams_count?: number;
  teams?: { id: number; name: string; slug: string }[];
  created_at: string;
  updated_at: string;
}

export interface CoachFormData {
  first_name: string;
  last_name: string;
  bio?: string;
}
