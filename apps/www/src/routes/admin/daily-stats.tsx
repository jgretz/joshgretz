import {createFileRoute} from '@tanstack/react-router';
import {useCallback} from 'react';
import {RecalcPanel} from '../../components/admin/recalc-panel';
import {AdminLayout} from '../../components/layout/admin-layout';
import {title} from '../../config.shared';
import {requireAuth} from '../../services/auth/requireAuth';
import {enqueueDailyStatsRecalc} from '../../services/daily-stats/daily-stats-server';

export const Route = createFileRoute('/admin/daily-stats')({
  component: DailyStatsPage,
  beforeLoad: requireAuth,
  head: () => ({
    meta: [{title: title('Daily Stats')}],
  }),
});

function DailyStatsPage() {
  const {user} = Route.useRouteContext();

  const handleRecalc = useCallback(() => {
    if (!user) throw new Error('Not authenticated');
    return enqueueDailyStatsRecalc({data: {userId: user.id}});
  }, [user]);

  return (
    <AdminLayout title="Daily Stats">
      <RecalcPanel
        description="Queue a job to rebuild the per-day mileage behind the running heatmap from all activities. Runs that cross midnight are split across the days they cover, proportional to elapsed time. Runs in the background via the task worker."
        buttonLabel="Recalculate Daily Stats"
        onRecalc={handleRecalc}
      />
    </AdminLayout>
  );
}
