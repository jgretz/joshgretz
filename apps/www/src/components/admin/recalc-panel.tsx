import {useCallback, useState} from 'react';
import {Button} from '../ui/button';

type RecalcPanelProps = {
  description: string;
  buttonLabel: string;
  onRecalc: () => Promise<{id: number}>;
};

export const RecalcPanel = ({description, buttonLabel, onRecalc}: RecalcPanelProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [queuedJobId, setQueuedJobId] = useState<number | null>(null);

  const handleRecalc = useCallback(async () => {
    setLoading(true);
    setError(null);
    setQueuedJobId(null);

    try {
      const {id} = await onRecalc();
      setQueuedJobId(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to enqueue recalc');
    } finally {
      setLoading(false);
    }
  }, [onRecalc]);

  return (
    <div className="rounded-lg border border-warm-200 bg-white p-8">
      <p className="mb-6 text-warm-700">{description}</p>

      <Button type="button" disabled={loading} onClick={handleRecalc}>
        {loading ? 'Queuing...' : buttonLabel}
      </Button>

      {queuedJobId !== null && (
        <p className="mt-4 text-green-600">
          Job #{queuedJobId} queued. Check{' '}
          <a className="underline" href="/admin/jobs">
            /admin/jobs
          </a>{' '}
          for status.
        </p>
      )}
      {error && <p className="mt-4 text-red-600">{error}</p>}
    </div>
  );
};
