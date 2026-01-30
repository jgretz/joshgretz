import {createFileRoute, useRouter} from '@tanstack/react-router';
import {useCallback, useState} from 'react';
import {AdminLayout} from '../../components/layout/admin-layout';
import {Button} from '../../components/ui/button';
import {title} from '../../config.shared';
import {requireAuth} from '../../services/auth/requireAuth';
import {getStreak, upsertStreak} from '../../services/streak/streak-server';

export const Route = createFileRoute('/admin/streak')({
  component: StreakPage,
  beforeLoad: requireAuth,
  head: () => ({
    meta: [{title: title('Streak')}],
  }),
  loader: async ({context}) => {
    const {user} = context as {user: {id: number} | null};
    if (!user) return {streak: null};
    const streak = await getStreak({data: {userId: user.id}});
    return {streak};
  },
});

function StreakPage() {
  const router = useRouter();
  const {streak} = Route.useLoaderData();
  const {user} = Route.useRouteContext();

  const [startDate, setStartDate] = useState(streak?.start_date?.slice(0, 10) ?? '');
  const [totalRuns, setTotalRuns] = useState(streak?.total_runs?.toString() ?? '');
  const [totalMiles, setTotalMiles] = useState(streak?.total_miles ?? '');
  const [totalVert, setTotalVert] = useState(streak?.total_vert?.toString() ?? '');
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

      setLoading(true);
      setError(null);
      setSuccess(false);

      try {
        await upsertStreak({
          data: {
            userId: user.id,
            startDate: startDate || null,
            totalRuns: totalRuns ? parseInt(totalRuns, 10) : null,
            totalMiles: totalMiles || null,
            totalVert: totalVert ? parseInt(totalVert, 10) : null,
          },
        });
        await router.invalidate();
        setSuccess(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to save streak');
      } finally {
        setLoading(false);
      }
    },
    [user, startDate, totalRuns, totalMiles, totalVert, router],
  );

  const isEdit = !!streak;

  return (
    <AdminLayout title="Streak">
      <div className="rounded-lg border border-warm-200 bg-white p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="startDate" className="mb-2 block text-sm font-medium text-warm-700">
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-lg border border-warm-300 px-4 py-2 focus:border-warm-500 focus:outline-none focus:ring-2 focus:ring-warm-500"
            />
          </div>

          <div>
            <label htmlFor="totalRuns" className="mb-2 block text-sm font-medium text-warm-700">
              Total Runs
            </label>
            <input
              type="number"
              id="totalRuns"
              min="0"
              value={totalRuns}
              onChange={(e) => setTotalRuns(e.target.value)}
              placeholder="Number of runs"
              className="w-full rounded-lg border border-warm-300 px-4 py-2 focus:border-warm-500 focus:outline-none focus:ring-2 focus:ring-warm-500"
            />
          </div>

          <div>
            <label htmlFor="totalMiles" className="mb-2 block text-sm font-medium text-warm-700">
              Total Miles
            </label>
            <input
              type="number"
              id="totalMiles"
              min="0"
              step="0.01"
              value={totalMiles}
              onChange={(e) => setTotalMiles(e.target.value)}
              placeholder="Total miles"
              className="w-full rounded-lg border border-warm-300 px-4 py-2 focus:border-warm-500 focus:outline-none focus:ring-2 focus:ring-warm-500"
            />
          </div>

          <div>
            <label htmlFor="totalVert" className="mb-2 block text-sm font-medium text-warm-700">
              Total Vert (ft)
            </label>
            <input
              type="number"
              id="totalVert"
              min="0"
              value={totalVert}
              onChange={(e) => setTotalVert(e.target.value)}
              placeholder="Total elevation gain"
              className="w-full rounded-lg border border-warm-300 px-4 py-2 focus:border-warm-500 focus:outline-none focus:ring-2 focus:ring-warm-500"
            />
          </div>

          {error && <p className="text-red-600">{error}</p>}
          {success && <p className="text-green-600">Streak saved.</p>}

          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : isEdit ? 'Update Streak' : 'Create Streak'}
          </Button>
        </form>
      </div>
    </AdminLayout>
  );
}
