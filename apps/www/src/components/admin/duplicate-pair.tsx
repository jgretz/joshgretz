import {memo, useCallback, useState} from 'react';
import type {
  DuplicateActivityCandidate,
  DuplicateActivitySide,
} from '../../services/activities/activities-server';
import {Button} from '../ui/button';
import {
  formatDateTime,
  formatDelta,
  formatDistance,
  formatElevation,
  formatTime,
} from './activity-format';

type DuplicatePairProps = {
  pair: DuplicateActivityCandidate;
  // Per-copy booleans rather than the list-wide in-flight strava id: a delete on another pair
  // leaves both unchanged, so the memo below actually skips the re-render.
  deletingA: boolean;
  deletingB: boolean;
  onDelete: (stravaId: string) => void;
};

// Manual edits live on one copy only and no re-import brings them back, so deleting the copy
// that carries them silently loses work. See CLAUDE-WORKING.md.
const manualEdits = (side: DuplicateActivitySide): string[] => {
  const edits: string[] = [];
  if (side.location_state) edits.push(`state "${side.location_state}"`);
  if (side.featured_marathon) edits.push('featured race');
  return edits;
};

const formatCoordinates = (side: DuplicateActivitySide): string => {
  if (!side.start_lat || !side.start_lng) return 'no GPS';
  return `${parseFloat(side.start_lat).toFixed(5)}, ${parseFloat(side.start_lng).toFixed(5)}`;
};

const formatPlace = (side: DuplicateActivitySide): string => {
  const parts = [side.location_city, side.location_state].filter(Boolean);
  return parts.length > 0 ? parts.join(', ') : 'not set';
};

const formatHeartrate = (value: string | null): string => {
  if (!value) return '-';
  return `${Math.round(parseFloat(value))} bpm`;
};

type FieldProps = {
  label: string;
  value: string;
};

const Field = ({label, value}: FieldProps) => (
  <div className="flex justify-between gap-3 text-sm">
    <dt className="text-warm-500">{label}</dt>
    <dd className="text-right text-warm-800">{value}</dd>
  </div>
);

type CopyProps = {
  side: DuplicateActivitySide;
  deleting: boolean;
  onDelete: (stravaId: string) => void;
};

const Copy = ({side, deleting, onDelete}: CopyProps) => {
  const [confirming, setConfirming] = useState(false);
  const edits = manualEdits(side);

  const handleConfirm = useCallback(() => setConfirming(true), []);
  const handleCancel = useCallback(() => setConfirming(false), []);
  const handleDelete = useCallback(() => {
    setConfirming(false);
    onDelete(side.strava_id);
  }, [onDelete, side.strava_id]);

  return (
    <div className="rounded-lg border border-warm-200 bg-white p-4">
      <p className="mb-1 font-medium text-warm-900">{side.name ?? 'Untitled'}</p>
      <p className="mb-3 text-xs text-warm-500">
        activity #{side.id} ·{' '}
        <a
          href={`https://www.strava.com/activities/${side.strava_id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-warm-800"
        >
          strava.com/{side.strava_id}
        </a>
      </p>

      <dl className="space-y-1">
        <Field label="Started" value={formatDateTime(side.start_date_local ?? side.start_date)} />
        <Field label="Distance" value={formatDistance(side.distance)} />
        <Field label="Moving" value={formatTime(side.moving_time)} />
        <Field label="Elapsed" value={formatTime(side.elapsed_time)} />
        <Field label="Elevation" value={formatElevation(side.total_elevation_gain)} />
        <Field label="Avg HR" value={formatHeartrate(side.average_heartrate)} />
        <Field label="Gear" value={side.gear_id ?? '-'} />
        <Field label="Start GPS" value={formatCoordinates(side)} />
        <Field label="Place" value={formatPlace(side)} />
      </dl>

      {edits.length > 0 && (
        <p className="mt-3 rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-800">
          Carries manual edits ({edits.join(', ')}) that no re-import can restore. Prefer deleting
          the other copy.
        </p>
      )}

      <div className="mt-4">
        {confirming ? (
          <div className="flex items-center gap-3">
            <Button type="button" variant="destructive" size="sm" onClick={handleDelete}>
              Confirm delete
            </Button>
            <button
              type="button"
              onClick={handleCancel}
              className="text-sm text-warm-600 underline hover:text-warm-900"
            >
              Cancel
            </button>
          </div>
        ) : (
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={deleting}
            onClick={handleConfirm}
          >
            {deleting ? 'Deleting...' : 'Delete this copy'}
          </Button>
        )}
      </div>
    </div>
  );
};

export const DuplicatePair = memo(function DuplicatePair({
  pair,
  deletingA,
  deletingB,
  onDelete,
}: DuplicatePairProps) {
  return (
    <div className="rounded-lg border border-warm-300 bg-warm-50 p-4">
      <p className="mb-3 text-sm font-medium text-warm-700">
        {pair.a.type ?? 'Unknown'} ·{' '}
        {formatDelta(pair.start_delta_seconds, pair.distance_delta_meters)}
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <Copy side={pair.a} deleting={deletingA} onDelete={onDelete} />
        <Copy side={pair.b} deleting={deletingB} onDelete={onDelete} />
      </div>

      <p className="mt-3 text-xs text-warm-600">
        Deleting here only removes the local row. Strava is the source of truth, so the copy must
        also be deleted on strava.com or the next mass import will bring it straight back.
      </p>
    </div>
  );
});
