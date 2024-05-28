import {Button} from '@admin/components/ui/button';
import {getUser} from '@admin/services/auth/getUser';
import getThirdPartyAccess from '@admin/services/joshgretz-api/users/getThirdPartyAccess';
import type {LoaderFunctionArgs} from '@remix-run/node';
import {useLoaderData} from '@remix-run/react';
import {useCallback} from 'react';

import Strava from 'strava';

export async function loader({request}: LoaderFunctionArgs) {
  const user = await getUser(request);
  const access = await getThirdPartyAccess(user!);

  const url = new URL(request.url);
  const authUrl = Strava.utility.generateAuthUrl(
    `${url.protocol}//${url.hostname}:${url.port}/strava/callback`,
  );

  return {
    user,
    access,
    authUrl,
  };
}

export default function LoadActivities() {
  const {access, authUrl} = useLoaderData<typeof loader>();

  const isConnected = !!access?.strava_id;
  const buttonText = isConnected ? 'Reconnect to Strava' : 'Connect to Strava';

  const handleConnectClick = useCallback(() => {
    window.location.assign(authUrl);
  }, [authUrl]);

  return (
    <Button variant="secondary" onClick={handleConnectClick}>
      {buttonText}
    </Button>
  );
}
