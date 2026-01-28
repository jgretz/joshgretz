import {GetContainer} from 'injectx';
import type {StravaConfig} from './Types';
import generateAuthUrl from './auth/generateAuthUrl';
import requestAuthToken from './auth/requestAuthToken';
import getActivities from './activities/getActivities';
import getActivity from './activities/getActivity';

export * from './Types';

export const setupStravaContainer = ({accessToken}: StravaConfig) => {
  GetContainer().Bind(accessToken, {name: 'accessToken'});
};

export {generateAuthUrl, requestAuthToken, getActivities, getActivity};
