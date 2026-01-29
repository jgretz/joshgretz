import {createFileRoute} from '@tanstack/react-router';
import {useCallback, useEffect, useState} from 'react';
import {AdminLayout} from '../../../components/layout/admin-layout';
import {Button} from '../../../components/ui/button';
import {title} from '../../../config.shared';
import {getUserSession} from '../../../services/auth';
import {getStravaAuthUrl, getThirdPartyAccess} from '../../../services/auth/auth-server';
import {requireAuth} from '../../../services/auth/requireAuth';

export const Route = createFileRoute('/admin/strava/connect')({
  component: StravaConnect,
  beforeLoad: requireAuth,
  head: () => ({
    meta: [{title: title('Connect Strava')}],
  }),
});

function StravaConnect() {
  const user = getUserSession();
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkConnection = async () => {
      if (!user) return;

      try {
        const access = await getThirdPartyAccess({data: {userId: user.id}});
        setIsConnected(!!access?.strava_id);
      } catch {
        setIsConnected(false);
      } finally {
        setLoading(false);
      }
    };

    checkConnection();
  }, [user]);

  const handleConnect = useCallback(async () => {
    const redirectUri = `${window.location.origin}/admin/strava/callback`;

    try {
      const authUrl = await getStravaAuthUrl({data: {redirectUri}});
      window.location.href = authUrl;
    } catch (err) {
      console.error('Failed to get Strava auth URL:', err);
    }
  }, []);

  const buttonText = isConnected ? 'Reconnect to Strava' : 'Connect to Strava';

  return (
    <AdminLayout title="Connect to Strava">
      <div className="rounded-lg border border-warm-200 bg-white p-8">
        {loading ? (
          <p className="text-center text-warm-600">Loading...</p>
        ) : (
          <div className="text-center">
            {isConnected && <p className="mb-6 text-green-600">Your Strava account is connected</p>}
            <Button onClick={handleConnect}>{buttonText}</Button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
