import {Link, createFileRoute} from '@tanstack/react-router';
import {useCallback, useState} from 'react';
import {AdminLayout} from '../../../components/layout/admin-layout';
import {Button} from '../../../components/ui/button';
import {title} from '../../../config.shared';
import {getUserSession} from '../../../services/auth';
import {requireAuth} from '../../../services/auth/requireAuth';
import {
  deletePersonalRecord,
  getPersonalRecords,
} from '../../../services/personal-records/personal-records-server';

export const Route = createFileRoute('/admin/prs/')({
  component: PersonalRecordsList,
  beforeLoad: requireAuth,
  head: () => ({
    meta: [{title: title('Personal Records')}],
  }),
  loader: async () => {
    const user = getUserSession();
    if (!user) return {records: []};
    const records = await getPersonalRecords({data: {userId: user.id}});
    return {records};
  },
});

const formatTime = (seconds: number): string => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

function PersonalRecordsList() {
  const {records: initialRecords} = Route.useLoaderData();
  const [records, setRecords] = useState(initialRecords);
  const [deleting, setDeleting] = useState<number | null>(null);

  const handleDelete = useCallback(async (id: number) => {
    if (!confirm('Delete this personal record?')) return;

    setDeleting(id);
    try {
      await deletePersonalRecord({data: {id}});
      setRecords((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete');
    } finally {
      setDeleting(null);
    }
  }, []);

  return (
    <AdminLayout title="Personal Records">
      <div className="mb-6">
        <Link to="/admin/prs/new">
          <Button>Add New PR</Button>
        </Link>
      </div>

      {records.length === 0 ? (
        <p className="text-warm-600">No personal records yet.</p>
      ) : (
        <div className="space-y-4">
          {records.map((record) => (
            <div
              key={record.id}
              className="flex items-center justify-between rounded-lg border border-warm-200 bg-white p-4"
            >
              <div>
                <h3 className="font-medium text-warm-800">{record.title}</h3>
                <p className="text-warm-600">{formatTime(record.time_seconds)}</p>
              </div>
              <div className="flex gap-2">
                <Link to="/admin/prs/$id/edit" params={{id: String(record.id)}}>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </Link>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(record.id)}
                  disabled={deleting === record.id}
                >
                  {deleting === record.id ? 'Deleting...' : 'Delete'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
