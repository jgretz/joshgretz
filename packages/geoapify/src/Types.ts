export interface Location {
  name: string;
  state: string;
  country: string;
  lat: number;
  lon: number;
}

export interface GeoapifyConfig {
  apiKey: string;
}

export interface GeoapifyContainer {
  apiKey: string;
}
