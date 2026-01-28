import {storeStravaActivity} from './storeStravaActivity';
import {thirdPartyAccessForUser} from 'users';
import {getActivities, setupStravaContainer} from 'strava';

export const importActivitiesForDateRange = async (userId: number, from: Date, to: Date) => {
  console.log('Starting to import activities');

  // get third party access for user
  const access = await thirdPartyAccessForUser({id: userId});
  if (!access?.strava_access_token) {
    throw new Error('User does not have Strava access configured');
  }

  // setup strava container with access token
  setupStravaContainer({accessToken: access.strava_access_token});

  // load activities from strava
  const activities = await getActivities({before: to, after: from});

  // import activities
  await Promise.all(activities.map((activity) => storeStravaActivity(activity, userId)));

  console.log('Done importing activities');
};
