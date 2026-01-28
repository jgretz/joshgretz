import {createFileRoute, Link, useNavigate} from '@tanstack/react-router';
import {useCallback} from 'react';
import {requireAuth} from '../../services/auth/requireAuth';
import {clearUserSession, getUserSession} from '../../services/auth';
import {PageWrapper} from '../../components/layout/page-wrapper';
import {Button} from '../../components/ui/button';
import {title} from '../../config.shared';

export const Route = createFileRoute('/admin/')({
  component: AdminDashboard,
  beforeLoad: requireAuth,
  head: () => ({
    meta: [{title: title('Admin')}],
  }),
});

function AdminDashboard() {
  const navigate = useNavigate();
  const user = getUserSession();

  const handleLogout = useCallback(() => {
    clearUserSession();
    navigate({to: '/admin/login'});
  }, [navigate]);

  return (
    <PageWrapper className="py-12">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="font-serif text-3xl text-warm-800">Admin Dashboard</h1>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        {user && (
          <p className="mb-8 text-warm-600">
            Welcome, <span className="font-medium">{user.name || user.email}</span>
          </p>
        )}

        <div className="space-y-4">
          <Link
            to="/admin/strava"
            className="block rounded-lg border border-warm-200 bg-white p-6 transition-colors hover:border-warm-400"
          >
            <h2 className="mb-2 font-serif text-xl text-warm-800">Strava</h2>
            <p className="text-warm-600">Connect to Strava and import activities</p>
          </Link>
        </div>
      </div>
    </PageWrapper>
  );
}
