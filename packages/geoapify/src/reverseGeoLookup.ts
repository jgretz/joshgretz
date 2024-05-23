import axios from 'axios';
import type {GeoConfig, Location} from './Types';
import {encodeQueryStringFromJsonObject} from 'utility';

export function reverseGeoLookup(config: GeoConfig) {
  return async function (lat: number, lon: number) {
    const queryString = encodeQueryStringFromJsonObject({
      lat,
      lon,
      apiKey: config.apiKey,
    });

    const url = `https://api.geoapify.com/v1/geocode/reverse?${queryString}`;
    const response = await axios.get<Location[]>(url);

    if (response.data.length === 0) {
      return null;
    }

    return response.data[0];
  };
}
