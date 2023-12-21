import {LoaderFunctionArgs, json, redirect} from '@remix-run/node';
import {requireUser} from '../_services/requireUser';
import {ROUTES} from '../_constants/routes';
import {Button} from '~/components/ui/button';
import {useLoaderData} from '@remix-run/react';
import {useCallback} from 'react';

export async function loader({request}: LoaderFunctionArgs) {
  const user = await requireUser(request);
  if (!user) {
    return redirect(ROUTES.ADMIN);
  }

  const url = new URL(request.url);
  return json({
    stravaAppId: process.env.STRAVA_CLIENT_ID,
    redirect: `${url.protocol}//${url.hostname}:${url.port}/admin/strava/callback`,
  });
}

export default function Strava() {
  const loaderData = useLoaderData<typeof loader>();

  const handleConnectClick = useCallback(() => {
    const {stravaAppId, redirect} = loaderData;
    const url = `http://www.strava.com/oauth/authorize?client_id=${stravaAppId}&response_type=code&redirect_uri=${redirect}&approval_prompt=force&scope=read,activity:read`;

    window.location.assign(url);
  }, [redirect]);

  return (
    <div className="mt-2">
      <Button variant="secondary" onClick={handleConnectClick}>
        Connect to Strava
      </Button>
    </div>
  );
}
