import type {WeatherConfig} from './Types.ts';
import {reverseGeoLookup} from './reverseGeoLookup.ts';

export * from './Types.ts';

export default function (config: WeatherConfig) {
  return {
    reverseGeoLookup: reverseGeoLookup(config),
  };
}
