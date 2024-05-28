import {GetContainer} from 'injectx';
import type {GeoapifyConfig} from './Types.ts';
import {reverseGeocode} from './query/reverseGeocode.ts';

export * from './Types.ts';

export function setupGeoapifyContainer({apiKey}: GeoapifyConfig) {
  GetContainer().Bind(apiKey, {name: 'apiKey'});
}

export default {
  queries: {
    reverseGeocode,
  },
};
