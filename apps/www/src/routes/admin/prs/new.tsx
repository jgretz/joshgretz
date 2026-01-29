import {createFileRoute, useNavigate} from '@tanstack/react-router';
import {useCallback, useState} from 'react';
import {AdminLayout} from '../../../components/layout/admin-layout';
import {Button} from '../../../components/ui/button';
import {title} from '../../../config.shared';
import {getUserSession} from '../../../services/auth';
import {requireAuth} from '../../../services/auth/requireAuth';
import {createPersonalRecord} from '../../../services/personal-records/personal-records-server';

export const Route = createFileRoute('/admin/prs/new')({
  component: NewPersonalRecord,
  beforeLoad: requireAuth,
  head: () => ({
    meta: [{title: title('New Personal Record')}],
  }),
});

function NewPersonalRecord() {
  const navigate = useNavigate();
  const user = getUserSession();
  const [prTitle, setPrTitle] = useState('');
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');
  const [hours, setHours] = useState('');
  const [activityId, setActivityId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!user) {
        setError('Not authenticated');
        return;
      }

      if (!prTitle.trim()) {
        setError('Title is required');
        return;
      }

      const totalSeconds =
        parseInt(hours || '0', 10) * 3600 +
        parseInt(minutes || '0', 10) * 60 +
        parseInt(seconds || '0', 10);

      if (totalSeconds <= 0) {
        setError('Time must be greater than 0');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        await createPersonalRecord({
          data: {
            userId: user.id,
            title: prTitle.trim(),
            timeSeconds: totalSeconds,
            activityId: activityId ? parseInt(activityId, 10) : null,
          },
        });
        navigate({to: '/admin/prs'});
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to create personal record');
      } finally {
        setLoading(false);
      }
    },
    [user, prTitle, hours, minutes, seconds, activityId, navigate],
  );

  return (
    <AdminLayout title="New Personal Record">
      <div className="rounded-lg border border-warm-200 bg-white p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="mb-2 block text-sm font-medium text-warm-700">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={prTitle}
              onChange={(e) => setPrTitle(e.target.value)}
              placeholder="e.g., 5K, Marathon, Mile"
              className="w-full rounded-lg border border-warm-300 px-4 py-2 focus:border-warm-500 focus:outline-none focus:ring-2 focus:ring-warm-500"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-warm-700">Time</label>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <input
                  type="number"
                  min="0"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  placeholder="HH"
                  className="w-full rounded-lg border border-warm-300 px-4 py-2 focus:border-warm-500 focus:outline-none focus:ring-2 focus:ring-warm-500"
                />
                <span className="mt-1 block text-xs text-warm-500">Hours</span>
              </div>
              <div>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={minutes}
                  onChange={(e) => setMinutes(e.target.value)}
                  placeholder="MM"
                  className="w-full rounded-lg border border-warm-300 px-4 py-2 focus:border-warm-500 focus:outline-none focus:ring-2 focus:ring-warm-500"
                />
                <span className="mt-1 block text-xs text-warm-500">Minutes</span>
              </div>
              <div>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={seconds}
                  onChange={(e) => setSeconds(e.target.value)}
                  placeholder="SS"
                  className="w-full rounded-lg border border-warm-300 px-4 py-2 focus:border-warm-500 focus:outline-none focus:ring-2 focus:ring-warm-500"
                />
                <span className="mt-1 block text-xs text-warm-500">Seconds</span>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="activityId" className="mb-2 block text-sm font-medium text-warm-700">
              Activity ID (optional)
            </label>
            <input
              type="number"
              id="activityId"
              value={activityId}
              onChange={(e) => setActivityId(e.target.value)}
              placeholder="Link to activity"
              className="w-full rounded-lg border border-warm-300 px-4 py-2 focus:border-warm-500 focus:outline-none focus:ring-2 focus:ring-warm-500"
            />
          </div>

          {error && <p className="text-red-600">{error}</p>}

          <Button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create PR'}
          </Button>
        </form>
      </div>
    </AdminLayout>
  );
}
