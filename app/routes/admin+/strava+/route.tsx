import { type LoaderFunctionArgs, json, redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useCallback, useMemo } from 'react';
import { Button } from '~/components/ui/button.tsx';
import { ROUTES } from '../_constants/routes.ts';
import { requireUser } from '../_services/requireUser.ts';
import { importStravaActivities } from './_services/importStravaActivities.ts';

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUser(request);
  if (!user) {
    return redirect(ROUTES.ADMIN);
  }

  const url = new URL(request.url);
  return json({
    userId: user.id,
    connected: user.strava_id !== null,
    stravaAppId: process.env.STRAVA_CLIENT_ID,
    redirect: `${url.protocol}//${url.hostname}:${url.port}/admin/strava/callback`,
  });
}

export default function Strava() {
  const loaderData = useLoaderData<typeof loader>();

  // strava account connection
  const handleConnectClick = useCallback(() => {
    const { stravaAppId, redirect } = loaderData;
    const url = `http://www.strava.com/oauth/authorize?client_id=${stravaAppId}&response_type=code&redirect_uri=${redirect}&approval_prompt=force&scope=read,activity:read`;

    window.location.assign(url);
  }, [loaderData]);

  const buttonText = useMemo(() => {
    return loaderData.connected ? 'Reconnect to Strava' : 'Connect to Strava';
  }, [loaderData.connected]);

  // strava details
  const handleUpdateActivitiesClick = useCallback(async () => {
    await importStravaActivities(loaderData.userId);
  }, [loaderData.userId]);

  // UI
  return (
    <div className="mt-2 flex h-full flex-col">
      <Button variant="secondary" onClick={handleConnectClick}>
        {buttonText}
      </Button>
      <Button variant="secondary" onClick={handleUpdateActivitiesClick}>
        Import Strava Activities
      </Button>
    </div>
  );
}
