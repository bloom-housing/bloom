export interface Listing {
  id: number;
  name: string;
  image_url?: string;
  building_street_address: string;
  building_city: string;
  building_state: string;
  building_zip_code: string;
  neighborhood: string;
  year_built: number;
  required_documents: string;
  smoking_policy: string;
  pet_policy: string;
  amenities: string;
  developer: string;
  credit_history: string;
  rental_history: string;
}
