export interface Location {
  name: string;
  state: string;
  country: string;
  lat: number;
  lon: number;
}

export interface GeoConfig {
  apiKey: string;
}
