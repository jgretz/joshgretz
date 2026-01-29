import {createFileRoute} from '@tanstack/react-router';
import {useCallback, useState} from 'react';
import {AdminLayout} from '../../../components/layout/admin-layout';
import {Button} from '../../../components/ui/button';
import {title} from '../../../config.shared';
import {importActivities} from '../../../services/auth/auth-server';
import {requireAuth} from '../../../services/auth/requireAuth';

export const Route = createFileRoute('/admin/strava/import')({
  component: StravaImport,
  beforeLoad: requireAuth,
  head: () => ({
    meta: [{title: title('Import Activities')}],
  }),
});

function StravaImport() {
  const {user} = Route.useRouteContext();
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!user) {
        setError('Not authenticated');
        return;
      }

      if (!fromDate || !toDate) {
        setError('Please select both dates');
        return;
      }

      setLoading(true);
      setError(null);
      setSuccess(false);

      try {
        await importActivities({
          data: {
            userId: user.id,
            from: new Date(fromDate),
            to: new Date(toDate),
          },
        });
        setSuccess(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to import activities');
      } finally {
        setLoading(false);
      }
    },
    [user, fromDate, toDate],
  );

  return (
    <AdminLayout title="Import Activities">
      <div className="rounded-lg border border-warm-200 bg-white p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="from" className="mb-2 block text-sm font-medium text-warm-700">
                From Date
              </label>
              <input
                type="date"
                id="from"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full rounded-lg border border-warm-300 px-4 py-2 focus:border-warm-500 focus:outline-none focus:ring-2 focus:ring-warm-500"
                required
              />
            </div>
            <div>
              <label htmlFor="to" className="mb-2 block text-sm font-medium text-warm-700">
                To Date
              </label>
              <input
                type="date"
                id="to"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full rounded-lg border border-warm-300 px-4 py-2 focus:border-warm-500 focus:outline-none focus:ring-2 focus:ring-warm-500"
                required
              />
            </div>
          </div>

          {error && <p className="text-red-600">{error}</p>}

          {success && (
            <p className="text-green-600">
              Activities imported successfully! Check the database for results.
            </p>
          )}

          <Button type="submit" disabled={loading}>
            {loading ? 'Importing...' : 'Import Activities'}
          </Button>
        </form>
      </div>
    </AdminLayout>
  );
}
