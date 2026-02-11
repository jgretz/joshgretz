import {createFileRoute} from '@tanstack/react-router';
import {useCallback, useState} from 'react';
import {AdminLayout} from '../../../components/layout/admin-layout';
import {Button} from '../../../components/ui/button';
import {title} from '../../../config.shared';
import {triggerGoogleSheetsSync} from '../../../services/google-sheets/google-sheets-server';
import {requireAuth} from '../../../services/auth/requireAuth';

export const Route = createFileRoute('/admin/google/sync')({
  component: GoogleSync,
  beforeLoad: requireAuth,
  head: () => ({
    meta: [{title: title('Sync to Sheets')}],
  }),
});

function GoogleSync() {
  const {user} = Route.useRouteContext();
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSync = useCallback(
    async (fullSync: boolean) => {
      if (!user) {
        setError('Not authenticated');
        return;
      }

      if (!fullSync && (!fromDate || !toDate)) {
        setError('Please select both dates');
        return;
      }

      setLoading(true);
      setError(null);
      setSuccess(null);

      try {
        await triggerGoogleSheetsSync({
          data: {
            userId: user.id,
            from: fullSync ? undefined : fromDate,
            to: fullSync ? undefined : toDate,
            fullSync,
          },
        });
        setSuccess(fullSync ? 'Full sync job created' : 'Sync job created for date range');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to trigger sync');
      } finally {
        setLoading(false);
      }
    },
    [user, fromDate, toDate],
  );

  return (
    <AdminLayout title="Sync to Google Sheets">
      <div className="space-y-6">
        <div className="rounded-lg border border-warm-200 bg-white p-8">
          <h2 className="mb-4 font-serif text-xl text-warm-800">Sync Date Range</h2>
          <div className="space-y-4">
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
                />
              </div>
            </div>
            <Button onClick={() => handleSync(false)} disabled={loading}>
              {loading ? 'Syncing...' : 'Sync Range'}
            </Button>
          </div>
        </div>

        <div className="rounded-lg border border-warm-200 bg-white p-8">
          <h2 className="mb-4 font-serif text-xl text-warm-800">Full Sync</h2>
          <p className="mb-4 text-warm-600">
            Clears the sheet and writes all activities. Use for initial setup or to fix data.
          </p>
          <Button onClick={() => handleSync(true)} disabled={loading} variant="outline">
            {loading ? 'Syncing...' : 'Full Sync'}
          </Button>
        </div>

        {error && <p className="text-red-600">{error}</p>}
        {success && <p className="text-green-600">{success}</p>}
      </div>
    </AdminLayout>
  );
}
