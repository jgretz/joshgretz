import {createFileRoute} from '@tanstack/react-router';
import {useCallback, useState} from 'react';
import {AdminLayout} from '../../components/layout/admin-layout';
import {Button} from '../../components/ui/button';
import {title} from '../../config.shared';
import {requireAuth} from '../../services/auth/requireAuth';
import {enqueueStateStatsRecalc} from '../../services/state-stats/state-stats-server';

export const Route = createFileRoute('/admin/state-stats')({
  component: StateStatsPage,
  beforeLoad: requireAuth,
  head: () => ({
    meta: [{title: title('State Stats')}],
  }),
});

function StateStatsPage() {
  const {user} = Route.useRouteContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [queuedJobId, setQueuedJobId] = useState<number | null>(null);

  const handleRecalc = useCallback(async () => {
    if (!user) {
      setError('Not authenticated');
      return;
    }

    setLoading(true);
    setError(null);
    setQueuedJobId(null);

    try {
      const {id} = await enqueueStateStatsRecalc({data: {userId: user.id}});
      setQueuedJobId(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to enqueue recalc');
    } finally {
      setLoading(false);
    }
  }, [user]);

  return (
    <AdminLayout title="State Stats">
      <div className="rounded-lg border border-warm-200 bg-white p-8">
        <p className="mb-6 text-warm-700">
          Queue a job to recalculate per-state running stats from all activities.
          Runs in the background via the task worker.
        </p>

        <Button type="button" disabled={loading} onClick={handleRecalc}>
          {loading ? 'Queuing...' : 'Recalculate State Stats'}
        </Button>

        {queuedJobId !== null && (
          <p className="mt-4 text-green-600">
            Job #{queuedJobId} queued. Check{' '}
            <a className="underline" href="/admin/jobs">
              /admin/jobs
            </a>{' '}
            for status.
          </p>
        )}
        {error && <p className="mt-4 text-red-600">{error}</p>}
      </div>
    </AdminLayout>
  );
}
