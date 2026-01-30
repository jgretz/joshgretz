import {createFileRoute} from '@tanstack/react-router';
import {type FormEvent, useCallback, useState} from 'react';
import {AdminLayout} from '../../../components/layout/admin-layout';
import {Button} from '../../../components/ui/button';
import {title} from '../../../config.shared';
import {requireAuth} from '../../../services/auth/requireAuth';
import {searchActivities} from '../../../services/activities/activities-server';

type Activity = {
  id: number;
  name: string | null;
  strava_id: string;
  start_date_local: string | null;
  distance: string | null;
  moving_time: string | null;
};

type SearchMode = 'title' | 'strava_id';

export const Route = createFileRoute('/admin/activities/')({
  component: ActivityLookup,
  beforeLoad: requireAuth,
  head: () => ({
    meta: [{title: title('Activity Lookup')}],
  }),
});

const formatDistance = (meters: string | null): string => {
  if (!meters) return '-';
  const mi = parseFloat(meters) / 1609.34;
  return `${mi.toFixed(2)} mi`;
};

const formatTime = (seconds: string | null): string => {
  if (!seconds) return '-';
  const total = Math.round(parseFloat(seconds));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${m}:${s.toString().padStart(2, '0')}`;
};

const formatDate = (date: string | null): string => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

function ActivityLookup() {
  const {user} = Route.useRouteContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [mode, setMode] = useState<SearchMode>('title');
  const [results, setResults] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (!searchTerm.trim() || !user) return;

      setLoading(true);
      setSearched(true);
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

      {searched && !loading && results.length === 0 && (
        <p className="text-warm-600">No results found.</p>
      )}

      {results.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-warm-200">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-warm-200 bg-warm-50">
              <tr>
                <th className="px-4 py-3 font-medium text-warm-700">ID</th>
                <th className="px-4 py-3 font-medium text-warm-700">Title</th>
                <th className="px-4 py-3 font-medium text-warm-700">Date</th>
                <th className="px-4 py-3 font-medium text-warm-700">Distance</th>
                <th className="px-4 py-3 font-medium text-warm-700">Time</th>
                <th className="px-4 py-3 font-medium text-warm-700">Strava ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warm-100">
              {results.map((activity) => (
                <tr key={activity.id} className="bg-white">
                  <td className="px-4 py-3 text-warm-600">{activity.id}</td>
                  <td className="px-4 py-3 text-warm-800">{activity.name ?? '-'}</td>
                  <td className="px-4 py-3 text-warm-600">
                    {formatDate(activity.start_date_local)}
                  </td>
                  <td className="px-4 py-3 text-warm-600">{formatDistance(activity.distance)}</td>
                  <td className="px-4 py-3 text-warm-600">{formatTime(activity.moving_time)}</td>
                  <td className="px-4 py-3">
                    <a
                      href={`https://www.strava.com/activities/${activity.strava_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-warm-700 underline hover:text-warm-900"
                    >
                      {activity.strava_id}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
