import { redirect, type LoaderFunctionArgs } from '@remix-run/node';
import { ROUTES } from '../_constants/routes.ts';
import { getUser } from '../_services/getUser.ts';
import { getStravaAccessDetails } from './_services/getStravaAccessDetails.ts';
import { updateStravaAccessDetails } from './_services/updateStravaAccessDetails.ts';

export async function loader({ request }: LoaderFunctionArgs): Promise<{}> {
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

  // get strava data
  const stravaData = await getStravaAccessDetails(token);

  // update our access information
  await updateStravaAccessDetails(user, token, stravaData.access_token, stravaData.athlete.id);

  // done
  return redirect(ROUTES.STRAVA);
}
