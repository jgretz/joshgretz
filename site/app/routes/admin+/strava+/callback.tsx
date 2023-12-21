import {redirect, type LoaderFunctionArgs} from '@remix-run/node';
import {ROUTES} from '../_constants/routes';
import {getUser} from '../_services/getUser';
import {getStravaAccessDetails} from './_services/getStravaAccessDetails';
import {updateStravaAccessDetails} from './_services/updateStravaAccessDetails';

export async function loader({request}: LoaderFunctionArgs): Promise<{}> {
  // verify we have a logged in user
  const user = await getUser(request);
  if (!user) {
    return redirect(ROUTES.ADMIN);
  }

  // get token
  const url = new URL(request.url);
  const token = url.searchParams.get('code');

  if (!token) {
    return redirect(ROUTES.STRAVA);
  }

  console.log('token', token);

  // get strava data
  const stravaData = await getStravaAccessDetails(token);

  console.log('stravaData', stravaData);

  // update our access information
  await updateStravaAccessDetails(user, token, stravaData.access_token, stravaData.athlete.id);

  console.log('updated strava access details');

  // done
  return redirect(ROUTES.STRAVA);
}
