import {createFileRoute, useNavigate} from '@tanstack/react-router';
import {useEffect, useRef, useState} from 'react';
import {PageWrapper} from '../../../components/layout/page-wrapper';
import {handleGoogleSheetsCallback} from '../../../services/google-sheets/google-sheets-server';

export const Route = createFileRoute('/admin/google/callback')({
  component: GoogleCallback,
  validateSearch: (search: Record<string, unknown>) => ({
    code: (search.code as string) || '',
    error: search.error as string | undefined,
  }),
});

function GoogleCallback() {
  const navigate = useNavigate();
  const {code, error: oauthError} = Route.useSearch();
  const {user} = Route.useRouteContext();
  const [error, setError] = useState<string | null>(null);
  const processed = useRef(false);

  useEffect(() => {
    if (processed.current) return;

    if (oauthError) {
      setError(`Google error: ${oauthError}`);
      return;
    }

    if (!code) {
      setError('No authorization code received');
      return;
    }

    processed.current = true;

    const processCallback = async () => {
      if (!user) {
        setError('Not authenticated');
        return;
      }

      try {
        const redirectUri = `${window.location.origin}/admin/google/callback`;
        await handleGoogleSheetsCallback({
          data: {code, userId: user.id, redirectUri},
        });
        navigate({to: '/admin/google'});
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to connect Google');
      }
    };

    processCallback();
  }, [code, oauthError, navigate, user]);

  if (error) {
    return (
      <PageWrapper className="flex min-h-screen items-center justify-center">
        <div className="w-full max-w-md">
          <div className="rounded-lg border border-red-200 bg-red-50 p-8">
            <h1 className="mb-4 text-center font-serif text-xl text-red-800">Connection Failed</h1>
            <p className="text-center text-red-600">{error}</p>
            <div className="mt-6 text-center">
              <a
                href="/admin/google/connect"
                className="text-warm-600 underline hover:text-warm-800"
              >
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
        <p className="text-warm-600">Connecting to Google...</p>
      </div>
    </PageWrapper>
  );
}
