import {getUser} from '@admin/services/auth/getUser';
import getThirdPartyAccess from '@admin/services/joshgretz-api/users/getThirdPartyAccess';
import type {LoaderFunctionArgs} from '@remix-run/node';
import {StravaConnectButton} from './_components/strava-connect-button';
import {generateAuthUrl} from 'strava';

export async function loader({request}: LoaderFunctionArgs) {
  const user = await getUser(request);
  const access = await getThirdPartyAccess(user!);

  const url = new URL(request.url);
  const authUrl = generateAuthUrl(`${url.protocol}//${url.hostname}:${url.port}/strava/callback`);

  return {
    user,
    access,

    authUrl,
  };
}

export type IndexLoaderData = ReturnType<typeof loader>;

export default function Strava() {
  return (
    <div>
      <div>
        <StravaConnectButton />
      </div>
    </div>
  );
}
