import {createFileRoute, useNavigate} from '@tanstack/react-router';
import {useEffect, useState} from 'react';
import {requireAuth} from '../../../services/auth/requireAuth';
import {getUserSession} from '../../../services/auth';
import {handleStravaCallback} from '../../../services/auth/auth-server';
import {PageWrapper} from '../../../components/layout/page-wrapper';

export const Route = createFileRoute('/admin/strava/callback')({
  component: StravaCallback,
  beforeLoad: requireAuth,
  validateSearch: (search: Record<string, unknown>) => ({
    code: (search.code as string) || '',
    error: search.error as string | undefined,
  }),
});

function StravaCallback() {
  const navigate = useNavigate();
  const {code, error: oauthError} = Route.useSearch();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (oauthError) {
      setError(`Strava error: ${oauthError}`);
      return;
    }

    if (!code) {
      setError('No authorization code received');
      return;
    }

    const processCallback = async () => {
      const user = getUserSession();
      if (!user) {
        setError('Not authenticated');
        return;
      }

      try {
        await handleStravaCallback({data: {code, userId: user.id}});
        navigate({to: '/admin/strava'});
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to connect Strava');
      }
    };

    processCallback();
  }, [code, oauthError, navigate]);

  if (error) {
    return (
      <PageWrapper className="flex min-h-screen items-center justify-center">
        <div className="w-full max-w-md">
          <div className="rounded-lg border border-red-200 bg-red-50 p-8">
            <h1 className="mb-4 text-center font-serif text-xl text-red-800">Connection Failed</h1>
            <p className="text-center text-red-600">{error}</p>
            <div className="mt-6 text-center">
              <a href="/admin/strava/connect" className="text-warm-600 underline hover:text-warm-800">
                Try again
              </a>
            </div>
          </div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <p className="text-warm-600">Connecting to Strava...</p>
      </div>
    </PageWrapper>
  );
}
