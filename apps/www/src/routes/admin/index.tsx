import {createFileRoute} from '@tanstack/react-router';
import {AdminLayout} from '../../components/layout/admin-layout';
import {title} from '../../config.shared';
import {getUserSession} from '../../services/auth';
import {requireAuth} from '../../services/auth/requireAuth';

export const Route = createFileRoute('/admin/')({
  component: AdminDashboard,
  beforeLoad: requireAuth,
  head: () => ({
    meta: [{title: title('Admin')}],
  }),
});

function AdminDashboard() {
  const user = getUserSession();

  return (
    <AdminLayout title="Admin Dashboard">
      {user && (
        <p className="text-warm-600">
          Welcome, <span className="font-medium">{user.name || user.email}</span>
        </p>
      )}
    </AdminLayout>
  );
}
