import {createFileRoute, Link} from '@tanstack/react-router';
import {requireAuth} from '../../../services/auth/requireAuth';
import {PageWrapper} from '../../../components/layout/page-wrapper';
import {title} from '../../../config.shared';

export const Route = createFileRoute('/admin/strava/')({
  component: StravaIndex,
  beforeLoad: requireAuth,
  head: () => ({
    meta: [{title: title('Strava')}],
  }),
});

function StravaIndex() {
  return (
    <PageWrapper className="py-12">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="font-serif text-3xl text-warm-800">Strava</h1>
          <Link to="/admin" className="text-warm-600 hover:text-warm-800">
            ← Back to Admin
          </Link>
        </div>

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
      </div>
    </PageWrapper>
  );
}
