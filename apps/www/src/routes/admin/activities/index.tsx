import {createFileRoute} from '@tanstack/react-router';
import {type FormEvent, useCallback, useState} from 'react';
import {ActivityRow, type AdminActivity} from '../../../components/admin/activity-row';
import {AdminLayout} from '../../../components/layout/admin-layout';
import {Button} from '../../../components/ui/button';
import {title} from '../../../config.shared';
import {searchActivities} from '../../../services/activities/activities-server';
import {requireAuth} from '../../../services/auth/requireAuth';
import {enqueueStateStatsRecalc} from '../../../services/state-stats/state-stats-server';

type SearchMode = 'title' | 'strava_id';

export const Route = createFileRoute('/admin/activities/')({
  component: ActivityLookup,
  beforeLoad: requireAuth,
  head: () => ({
    meta: [{title: title('Activity Lookup')}],
  }),
});

const COLUMNS = ['ID', 'Title', 'Date', 'Distance', 'Time', 'State', 'Race', 'Strava ID', ''];

function ActivityLookup() {
  const {user} = Route.useRouteContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [mode, setMode] = useState<SearchMode>('title');
  const [results, setResults] = useState<AdminActivity[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [recalcJobId, setRecalcJobId] = useState<number | null>(null);

  const handleSearch = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (!searchTerm.trim() || !user) return;

      setLoading(true);
      setSearched(true);
      setRecalcJobId(null);
      try {
        const data = await searchActivities({
          data: {
            userId: user.id,
            ...(mode === 'title' ? {q: searchTerm} : {stravaId: searchTerm}),
          },
        });
        setResults(data);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    },
    [searchTerm, mode, user],
  );

  // Editing an activity's state or featured flag only reaches the state map once the
  // aggregates are rebuilt, so queue that as part of the save.
  const handleSaved = useCallback(
    async (updated: AdminActivity) => {
      setResults((current) =>
        current.map((activity) => (activity.id === updated.id ? updated : activity)),
      );

      if (!user) return;

      try {
        const {id} = await enqueueStateStatsRecalc({data: {userId: user.id}});
        setRecalcJobId(id);
      } catch (err) {
        console.error('Failed to enqueue state stats recalc', err);
      }
    },
    [user],
  );

  return (
    <AdminLayout title="Activity Lookup">
      <form onSubmit={handleSearch} className="mb-8 space-y-4">
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm text-warm-700">
            <input
              type="radio"
              name="mode"
              checked={mode === 'title'}
              onChange={() => setMode('title')}
              className="accent-warm-700"
            />
            Title
          </label>
          <label className="flex items-center gap-2 text-sm text-warm-700">
            <input
              type="radio"
              name="mode"
              checked={mode === 'strava_id'}
              onChange={() => setMode('strava_id')}
              className="accent-warm-700"
            />
            Strava ID
          </label>
        </div>

        <div className="flex gap-3">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={mode === 'title' ? 'Search by title...' : 'Enter Strava activity ID...'}
            className="flex-1 rounded-md border border-warm-300 px-3 py-2 text-sm text-warm-800 placeholder:text-warm-400 focus:border-warm-500 focus:outline-none"
          />
          <Button type="submit" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </Button>
        </div>
      </form>

      {recalcJobId !== null && (
        <p className="mb-4 text-green-600">
          Saved. State stats recalc queued as job #{recalcJobId} — check{' '}
          <a className="underline" href="/admin/jobs">
            /admin/jobs
          </a>{' '}
          for status.
        </p>
      )}

      {searched && !loading && results.length === 0 && (
        <p className="text-warm-600">No results found.</p>
      )}

      {results.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-warm-200">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-warm-200 bg-warm-50">
              <tr>
                {COLUMNS.map((column, i) => (
                  <th
                    key={column || `actions-${i}`}
                    className="px-4 py-3 font-medium text-warm-700"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-warm-100">
              {results.map((activity) => (
                <ActivityRow key={activity.id} activity={activity} onSaved={handleSaved} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
