import axios from 'axios';
import {queryStringFromJson} from 'utility';
import type {WeatherConfig, Location} from './Types';

export function reverseGeoLookup(config: WeatherConfig) {
  return async function (lat: number, lon: number) {
    const queryString = queryStringFromJson({
      lat,
      lon,
      limit: 1,
      apiid: config.apiKey,
    });

    const url = `http://api.openweathermap.org/geo/1.0/reverse?${queryString}`;
    const response = await axios.get<Location[]>(url);

    if (response.data.length === 0) {
      return null;
    }

    return response.data[0];
  };
}
