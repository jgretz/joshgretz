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

const hasGps = (side: DuplicateActivitySide): boolean =>
  Boolean(side.start_lat) && Boolean(side.start_lng);

// Only what a re-import genuinely cannot rebuild. `featured_marathon` is never written by
// mapStravaActivityToRunningActivity, so it is always hand-set. `location_state` usually is
// not: the mapper reverse-geocodes city/state/country from `start_latlng`, so a copy with GPS
// gets its place back on the next import — it is unrecoverable only when there are no
// coordinates to geocode from. Warning on every geocoded copy would flag both sides of nearly
// every pair and teach the operator to ignore the flag.
const manualEdits = (side: DuplicateActivitySide): string[] => {
  const edits: string[] = [];
  if (side.featured_marathon) edits.push('featured race');
  if (side.location_state && !hasGps(side)) edits.push(`state "${side.location_state}"`);
  return edits;
};

const formatCoordinates = ({start_lat, start_lng}: DuplicateActivitySide): string =>
  start_lat && start_lng
    ? `${parseFloat(start_lat).toFixed(5)}, ${parseFloat(start_lng).toFixed(5)}`
    : 'no GPS';

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
  // True while *either* copy is being deleted. Both copies stay clickable otherwise, and
  // confirming the second one mid-flight removes the whole run from every aggregate — a worse
  // outcome than the duplicate this view exists to clean up.
  pairBusy: boolean;
  onDelete: (stravaId: string) => void;
};

const Copy = ({side, deleting, pairBusy, onDelete}: CopyProps) => {
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
            <Button
              type="button"
              variant="destructive"
              size="sm"
              disabled={pairBusy}
              onClick={handleDelete}
            >
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
            disabled={pairBusy}
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
  // Derived here rather than taken as a third prop: the two per-copy booleans are what the memo
  // above compares, and a separately passed pair flag could disagree with them.
  const pairBusy = deletingA || deletingB;

  return (
    <div className="rounded-lg border border-warm-300 bg-warm-50 p-4">
      <p className="mb-3 text-sm font-medium text-warm-700">
        {pair.a.type ?? 'Unknown'} ·{' '}
        {formatDelta(pair.start_delta_seconds, pair.distance_delta_meters)}
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <Copy side={pair.a} deleting={deletingA} pairBusy={pairBusy} onDelete={onDelete} />
        <Copy side={pair.b} deleting={deletingB} pairBusy={pairBusy} onDelete={onDelete} />
      </div>

      <p className="mt-3 text-xs text-warm-600">
        Deleting here only removes the local row. Strava is the source of truth, so the copy must
        also be deleted on strava.com or the next mass import will bring it straight back.
      </p>
    </div>
  );
});
