import {ROUTES} from '@admin/constants/routes';
import {getUser} from '@admin/services/auth/getUser';
import setThirdPartyAccess from '@admin/services/joshgretz-api/users/setThirdPartyAccess';
import {redirect, type LoaderFunctionArgs} from '@remix-run/node';
import {utilities} from 'strava';

export async function loader({request}: LoaderFunctionArgs): Promise<{}> {
  // verify we have a logged in user
  const user = await getUser(request);
  if (!user) {
    return redirect(ROUTES.ADMIN);
  }

  // get token
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  if (!code) {
    return redirect(ROUTES.STRAVA);
  }

  // get strava data
  const tokenResponse = await utilities.requestAuthToken(code);

  // update our access information
  await setThirdPartyAccess(user, {
    strava_id: tokenResponse.athlete.id,
    strava_access_token: tokenResponse.access_token,
    strava_code: code,
  });

  // done
  return redirect(ROUTES.STRAVA);
}
