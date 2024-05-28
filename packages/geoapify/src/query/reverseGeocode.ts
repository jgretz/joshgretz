import axios from 'axios';
import type {GeoapifyContainer, Location} from '../Types';
import {encodeQueryStringFromJsonObject} from 'utility';
import {InjectIn} from 'injectx';

function query({apiKey}: GeoapifyContainer) {
  return async function (lat: number, lon: number) {
    const queryString = encodeQueryStringFromJsonObject({
      lat,
      lon,
      apiKey,
    });

    const url = `https://api.geoapify.com/v1/geocode/reverse?${queryString}`;
    const response = await axios.get<Location[]>(url);

    if (response.data.length === 0) {
      return null;
    }

    return response.data[0];
  };
}

export const reverseGeocode = InjectIn(query);
