import {Link, createFileRoute, useNavigate, useRouter} from '@tanstack/react-router';
import {useCallback, useState} from 'react';
import {AdminLayout} from '../../../components/layout/admin-layout';
import {Button} from '../../../components/ui/button';
import {title} from '../../../config.shared';
import {requireAuth} from '../../../services/auth/requireAuth';
import {getFutureRace, updateFutureRace} from '../../../services/future-races/future-races-server';

export const Route = createFileRoute('/admin/races/$id/edit')({
  component: EditFutureRace,
  beforeLoad: requireAuth,
  head: () => ({
    meta: [{title: title('Edit Future Race')}],
  }),
  loader: async ({params}) => {
    const race = await getFutureRace({data: {id: parseInt(params.id, 10)}});
    return {race};
  },
});

const toDateInputValue = (dateStr: string | null): string => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toISOString().split('T')[0];
};

function EditFutureRace() {
  const navigate = useNavigate();
  const router = useRouter();
  const {race} = Route.useLoaderData();
  const {id} = Route.useParams();

  const [raceTitle, setRaceTitle] = useState(race?.title || '');
  const [location, setLocation] = useState(race?.location || '');
  const [distance, setDistance] = useState(race?.distance || '');
  const [url, setUrl] = useState(race?.url || '');
  const [raceDate, setRaceDate] = useState(toDateInputValue(race?.race_date ?? null));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!raceTitle.trim()) {
        setError('Title is required');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        await updateFutureRace({
          data: {
            id: parseInt(id, 10),
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
        setError(err instanceof Error ? err.message : 'Failed to update race');
      } finally {
        setLoading(false);
      }
    },
    [id, raceTitle, location, distance, url, raceDate, navigate, router],
  );

  if (!race) {
    return (
      <AdminLayout title="Edit Future Race">
        <p className="text-warm-600">Race not found.</p>
        <Link to="/admin/races" className="text-warm-600 hover:text-warm-800">
          Back to Races
        </Link>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Edit Future Race">
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
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </div>
    </AdminLayout>
  );
}
