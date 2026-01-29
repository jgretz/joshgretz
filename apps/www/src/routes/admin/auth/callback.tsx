import {createFileRoute, useNavigate} from '@tanstack/react-router';
import {useEffect, useState} from 'react';
import {PageWrapper} from '../../../components/layout/page-wrapper';
import {setUserSession} from '../../../services/auth';
import {exchangeCodeForUser} from '../../../services/auth/auth-server';

export const Route = createFileRoute('/admin/auth/callback')({
  component: AuthCallback,
  validateSearch: (search: Record<string, unknown>) => ({
    code: (search.code as string) || '',
    error: search.error as string | undefined,
  }),
});

function AuthCallback() {
  const navigate = useNavigate();
  const {code, error: oauthError} = Route.useSearch();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (oauthError) {
      setError(`OAuth error: ${oauthError}`);
      return;
    }

    if (!code) {
      setError('No authorization code received');
      return;
    }

    const handleCallback = async () => {
      try {
        const redirectUri = `${window.location.origin}/admin/auth/callback`;
        const user = await exchangeCodeForUser({data: {code, redirectUri}});
        setUserSession(user);
        navigate({to: '/admin'});
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Authentication failed');
      }
    };

    handleCallback();
  }, [code, oauthError, navigate]);

  if (error) {
    return (
      <PageWrapper className="flex min-h-screen items-center justify-center">
        <div className="w-full max-w-md">
          <div className="rounded-lg border border-red-200 bg-red-50 p-8">
            <h1 className="mb-4 text-center font-serif text-xl text-red-800">
              Authentication Failed
            </h1>
            <p className="text-center text-red-600">{error}</p>
            <div className="mt-6 text-center">
              <a href="/admin/login" className="text-warm-600 underline hover:text-warm-800">
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
        <p className="text-warm-600">Authenticating...</p>
      </div>
    </PageWrapper>
  );
}
