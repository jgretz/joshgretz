import {createFileRoute, useNavigate, useRouter} from '@tanstack/react-router';
import {useCallback, useState} from 'react';
import {AdminLayout} from '../../../components/layout/admin-layout';
import {Button} from '../../../components/ui/button';
import {title} from '../../../config.shared';
import {requireAuth} from '../../../services/auth/requireAuth';
import {createFutureRace} from '../../../services/future-races/future-races-server';

export const Route = createFileRoute('/admin/races/new')({
  component: NewFutureRace,
  beforeLoad: requireAuth,
  head: () => ({
    meta: [{title: title('New Future Race')}],
  }),
});

function NewFutureRace() {
  const navigate = useNavigate();
  const router = useRouter();
  const {user} = Route.useRouteContext();
  const [raceTitle, setRaceTitle] = useState('');
  const [location, setLocation] = useState('');
  const [distance, setDistance] = useState('');
  const [url, setUrl] = useState('');
  const [raceDate, setRaceDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!user) {
        setError('Not authenticated');
        return;
      }

      if (!raceTitle.trim()) {
        setError('Title is required');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        await createFutureRace({
          data: {
            userId: user.id,
            title: raceTitle.trim(),
            location: location.trim() || null,
            distance: distance.trim() || null,
            url: url.trim() || null,
            raceDate: raceDate || null,
          },
        });
        await router.invalidate();
        navigate({to: '/admin/races'});
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to create race');
      } finally {
        setLoading(false);
      }
    },
    [user, raceTitle, location, distance, url, raceDate, navigate, router],
  );

  return (
    <AdminLayout title="New Future Race">
      <div className="rounded-lg border border-warm-200 bg-white p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="mb-2 block text-sm font-medium text-warm-700">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={raceTitle}
              onChange={(e) => setRaceTitle(e.target.value)}
              placeholder="e.g., Boston Marathon 2025"
              className="w-full rounded-lg border border-warm-300 px-4 py-2 focus:border-warm-500 focus:outline-none focus:ring-2 focus:ring-warm-500"
              required
            />
          </div>

          <div>
            <label htmlFor="location" className="mb-2 block text-sm font-medium text-warm-700">
              Location
            </label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Boston, MA"
              className="w-full rounded-lg border border-warm-300 px-4 py-2 focus:border-warm-500 focus:outline-none focus:ring-2 focus:ring-warm-500"
            />
          </div>

          <div>
            <label htmlFor="distance" className="mb-2 block text-sm font-medium text-warm-700">
              Distance
            </label>
            <input
              type="text"
              id="distance"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              placeholder="e.g., Marathon, 10K, 50 miles"
              className="w-full rounded-lg border border-warm-300 px-4 py-2 focus:border-warm-500 focus:outline-none focus:ring-2 focus:ring-warm-500"
            />
          </div>

          <div>
            <label htmlFor="url" className="mb-2 block text-sm font-medium text-warm-700">
              URL
            </label>
            <input
              type="url"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://race-website.com"
              className="w-full rounded-lg border border-warm-300 px-4 py-2 focus:border-warm-500 focus:outline-none focus:ring-2 focus:ring-warm-500"
            />
          </div>

          <div>
            <label htmlFor="raceDate" className="mb-2 block text-sm font-medium text-warm-700">
              Race Date
            </label>
            <input
              type="date"
              id="raceDate"
              value={raceDate}
              onChange={(e) => setRaceDate(e.target.value)}
              className="w-full rounded-lg border border-warm-300 px-4 py-2 focus:border-warm-500 focus:outline-none focus:ring-2 focus:ring-warm-500"
            />
          </div>

          {error && <p className="text-red-600">{error}</p>}

          <Button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Race'}
          </Button>
        </form>
      </div>
    </AdminLayout>
  );
}
