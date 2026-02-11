import {Link, createFileRoute} from '@tanstack/react-router';
import {AdminLayout} from '../../../components/layout/admin-layout';
import {title} from '../../../config.shared';
import {requireAuth} from '../../../services/auth/requireAuth';

export const Route = createFileRoute('/admin/google/')({
  component: GoogleIndex,
  beforeLoad: requireAuth,
  head: () => ({
    meta: [{title: title('Google Sheets')}],
  }),
});

function GoogleIndex() {
  return (
    <AdminLayout title="Google Sheets">
      <div className="space-y-4">
        <Link
          to="/admin/google/connect"
          className="block rounded-lg border border-warm-200 bg-white p-6 transition-colors hover:border-warm-400"
        >
          <h2 className="mb-2 font-serif text-xl text-warm-800">Connect to Google</h2>
          <p className="text-warm-600">Link your Google account for Sheets access</p>
        </Link>

        <Link
          to="/admin/google/sync"
          className="block rounded-lg border border-warm-200 bg-white p-6 transition-colors hover:border-warm-400"
        >
          <h2 className="mb-2 font-serif text-xl text-warm-800">Sync Activities</h2>
          <p className="text-warm-600">Sync running data to Google Sheets</p>
        </Link>
      </div>
    </AdminLayout>
  );
}
