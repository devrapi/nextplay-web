export interface Venue {
  id: number;
  name: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
  updated_at: string;
}

export interface VenueFormData {
  name: string;
  address?: string;
  latitude?: number | null;
  longitude?: number | null;
}
