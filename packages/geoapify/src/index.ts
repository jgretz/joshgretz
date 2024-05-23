import type {GeoConfig} from './Types.ts';
import {reverseGeoLookup} from './reverseGeoLookup.ts';

export * from './Types.ts';

export type Geo = ReturnType<typeof createGeo>;

export default function createGeo(config: GeoConfig) {
  return {
    reverseGeoLookup: reverseGeoLookup(config),
  };
}
