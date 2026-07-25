import {createFileRoute} from '@tanstack/react-router';
import {useCallback} from 'react';
import {RecalcPanel} from '../../components/admin/recalc-panel';
import {AdminLayout} from '../../components/layout/admin-layout';
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

  const handleRecalc = useCallback(() => {
    if (!user) throw new Error('Not authenticated');
    return enqueueStateStatsRecalc({data: {userId: user.id}});
  }, [user]);

  return (
    <AdminLayout title="State Stats">
      <RecalcPanel
        description="Queue a job to recalculate per-state running stats from all activities. Runs in the background via the task worker."
        buttonLabel="Recalculate State Stats"
        onRecalc={handleRecalc}
      />
    </AdminLayout>
  );
}
