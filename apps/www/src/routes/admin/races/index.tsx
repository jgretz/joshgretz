import {Link, createFileRoute} from '@tanstack/react-router';
import {useCallback, useState} from 'react';
import {AdminLayout} from '../../../components/layout/admin-layout';
import {Button} from '../../../components/ui/button';
import {title} from '../../../config.shared';
import {requireAuth} from '../../../services/auth/requireAuth';
import {deleteFutureRace, getFutureRaces} from '../../../services/future-races/future-races-server';

export const Route = createFileRoute('/admin/races/')({
  component: FutureRacesList,
  beforeLoad: requireAuth,
  head: () => ({
    meta: [{title: title('Future Races')}],
  }),
  loader: async ({context}) => {
    const {user} = context as {user: {id: number} | null};
    if (!user) return {races: []};
    const races = await getFutureRaces({data: {userId: user.id}});
    return {races};
  },
});

const formatDate = (dateStr: string | null): string => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'});
};

function FutureRacesList() {
  const {races: loaderRaces} = Route.useLoaderData();
  const [deletedIds, setDeletedIds] = useState<Set<number>>(new Set());
  const [deleting, setDeleting] = useState<number | null>(null);

  const races = loaderRaces.filter((r) => !deletedIds.has(r.id));

  const handleDelete = useCallback(async (id: number) => {
    if (!confirm('Delete this race?')) return;

    setDeleting(id);
    try {
      await deleteFutureRace({data: {id}});
      setDeletedIds((prev) => new Set(prev).add(id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete');
    } finally {
      setDeleting(null);
    }
  }, []);

  return (
    <AdminLayout title="Future Races">
      <div className="mb-6">
        <Link to="/admin/races/new">
          <Button>Add New Race</Button>
        </Link>
      </div>

      {races.length === 0 ? (
        <p className="text-warm-600">No future races yet.</p>
      ) : (
        <div className="space-y-4">
          {races.map((race) => (
            <div
              key={race.id}
              className="flex items-center justify-between rounded-lg border border-warm-200 bg-white p-4"
            >
              <div>
                <h3 className="font-medium text-warm-800">{race.title}</h3>
                <div className="flex gap-3 text-sm text-warm-600">
                  {race.distance && <span>{race.distance}</span>}
                  {race.location && <span>{race.location}</span>}
                  {race.race_date && <span>{formatDate(race.race_date)}</span>}
                </div>
                {race.url && (
                  <a
                    href={race.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-warm-500 hover:text-warm-700"
                  >
                    Race website
                  </a>
                )}
              </div>
              <div className="flex gap-2">
                <Link to="/admin/races/$id/edit" params={{id: String(race.id)}}>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </Link>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(race.id)}
                  disabled={deleting === race.id}
                >
                  {deleting === race.id ? 'Deleting...' : 'Delete'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
