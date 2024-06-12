import {GetContainer} from 'injectx';
import type {StravaConfig} from './Types.ts';
import generateAuthUrl from './auth/generateAuthUrl.ts';
import requestAuthToken from './auth/requestAuthToken.ts';

export * from './Types.ts';
export {Bus} from './bus/index.ts';

export function setupStravaContainer({accessToken}: StravaConfig) {
  GetContainer().Bind(accessToken, {name: 'accessToken'});
}

export const utilities = {generateAuthUrl, requestAuthToken};
