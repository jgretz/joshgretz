import {Link, createFileRoute} from '@tanstack/react-router';
import {AdminLayout} from '../../../components/layout/admin-layout';
import {title} from '../../../config.shared';
import {requireAuth} from '../../../services/auth/requireAuth';

export const Route = createFileRoute('/admin/strava/')({
  component: StravaIndex,
  beforeLoad: requireAuth,
  head: () => ({
    meta: [{title: title('Strava')}],
  }),
});

function StravaIndex() {
  return (
    <AdminLayout title="Strava">
      <div className="space-y-4">
        <Link
          to="/admin/strava/connect"
          className="block rounded-lg border border-warm-200 bg-white p-6 transition-colors hover:border-warm-400"
        >
          <h2 className="mb-2 font-serif text-xl text-warm-800">Connect to Strava</h2>
          <p className="text-warm-600">Link your Strava account</p>
        </Link>

        <Link
          to="/admin/strava/import"
          className="block rounded-lg border border-warm-200 bg-white p-6 transition-colors hover:border-warm-400"
        >
          <h2 className="mb-2 font-serif text-xl text-warm-800">Import Activities</h2>
          <p className="text-warm-600">Import activities from Strava</p>
        </Link>
      </div>
    </AdminLayout>
  );
}
