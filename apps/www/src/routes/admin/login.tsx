import {createFileRoute, useNavigate} from '@tanstack/react-router';
import {useCallback, useEffect} from 'react';
import {PageWrapper} from '../../components/layout/page-wrapper';
import {Button} from '../../components/ui/button';
import {title} from '../../config.shared';
import {isAuthenticated} from '../../services/auth';
import {getGoogleOAuthUrl} from '../../services/auth/auth-server';

export const Route = createFileRoute('/admin/login')({
  component: AdminLogin,
  head: () => ({
    meta: [{title: title('Admin Login')}],
  }),
});

function AdminLogin() {
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      navigate({to: '/admin'});
    }
  }, [navigate]);

  const handleLogin = useCallback(async () => {
    const redirectUri = `${window.location.origin}/admin/auth/callback`;
    const authUrl = await getGoogleOAuthUrl({data: {redirectUri}});
    window.location.href = authUrl;
  }, []);

  return (
    <PageWrapper className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md">
        <div className="rounded-lg border border-warm-200 bg-white p-8 shadow-sm">
          <h1 className="mb-6 text-center font-serif text-2xl text-warm-800">Admin Login</h1>
          <p className="mb-6 text-center text-warm-600">Sign in to access the admin dashboard.</p>
          <Button onClick={handleLogin} className="w-full">
            Sign in with Google
          </Button>
        </div>
      </div>
    </PageWrapper>
  );
}
