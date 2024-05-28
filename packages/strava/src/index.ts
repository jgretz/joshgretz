import {GetContainer} from 'injectx';
import type {StravaConfig} from './Types.ts';
import getActivities from './activities/getActivities.ts';
import getActivity from './activities/getActivity.ts';
import getAthlete from './athlete/getAthlete.ts';
import generateAuthUrl from './auth/generateAuthUrl.ts';
import requestAuthToken from './auth/requestAuthToken.ts';
import getGear from './gear/getGear.ts';

export * from './Types.ts';

export function setupStravaContainer({accessToken}: StravaConfig) {
  GetContainer().Bind(accessToken, {name: 'accessToken'});
}

export default {
  utility: {generateAuthUrl, requestAuthToken},

  queries: {
    getAthlete,
    getGear,

    getActivities,
    getActivity,
  },
};
