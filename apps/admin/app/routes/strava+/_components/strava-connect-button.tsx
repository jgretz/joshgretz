import {useLoaderData} from '@remix-run/react';
import {useCallback} from 'react';
import type {IndexLoaderData} from '..';
import {Button} from '@admin/components/ui/button';

export function StravaConnectButton() {
  const {access, authUrl} = useLoaderData<IndexLoaderData>();

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
