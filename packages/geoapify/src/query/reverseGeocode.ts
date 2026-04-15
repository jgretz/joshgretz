import axios from 'axios';
import type {GeoapifyContainer, Location} from '../Types';
import {encodeQueryStringFromJsonObject} from 'utility';
import {InjectIn} from 'injectx';

type GeoapifyFeature = {
  properties: {
    name?: string;
    city?: string;
    state?: string;
    country?: string;
    lat?: number;
    lon?: number;
  };
};

type GeoapifyResponse = {
  features: GeoapifyFeature[];
};

function query({apiKey}: GeoapifyContainer) {
  return async function (lat: number, lon: number): Promise<Location | null> {
    const queryString = encodeQueryStringFromJsonObject({
      lat,
      lon,
      apiKey,
    });

    const url = `https://api.geoapify.com/v1/geocode/reverse?${queryString}`;
    const response = await axios.get<GeoapifyResponse>(url);

    const feature = response.data?.features?.[0];
    if (!feature) {
      return null;
    }

    const {name, city, state, country, lat: fLat, lon: fLon} = feature.properties;
    if (!state || !country) {
      return null;
    }

    return {
      name: city ?? name ?? '',
      state,
      country,
      lat: fLat ?? lat,
      lon: fLon ?? lon,
    };
  };
}

export const reverseGeocode = InjectIn(query);
