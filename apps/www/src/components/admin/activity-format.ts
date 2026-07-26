// Activity numerics arrive from Postgres `numeric` columns as strings, and the timestamp
// columns are rendered space separated ("2026-07-26 08:32:03") rather than as ISO. Shared by
// every admin view that renders an activity.

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;

const TIMESTAMP = /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2}):(\d{2}))?/;

export const formatDistance = (meters: string | null): string => {
  if (!meters) return '-';
  return `${(parseFloat(meters) / 1609.34).toFixed(2)} mi`;
};

export const formatTime = (seconds: string | null): string => {
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

export const formatDate = (date: string | null): string => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatElevation = (meters: string | null): string => {
  if (!meters) return '-';
  return `${Math.round(parseFloat(meters) * 3.28084)} ft`;
};

// Telling two recordings of the same run apart needs seconds. Formatted from the string parts
// rather than through Date, because start_date_local is already the runner's wall clock and
// must not be shifted into the viewer's timezone.
export const formatDateTime = (timestamp: string | null): string => {
  if (!timestamp) return '-';

  const match = TIMESTAMP.exec(timestamp.trim());
  if (!match) return timestamp;

  const [, year = '', month = '', day = '', hours, minutes, seconds] = match;
  const monthName = MONTHS[parseInt(month, 10) - 1] ?? month;
  const datePart = `${monthName} ${parseInt(day, 10)}, ${year}`;

  if (!hours) return datePart;

  const hour24 = parseInt(hours, 10);
  const suffix = hour24 >= 12 ? 'PM' : 'AM';
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;

  return `${datePart}, ${hour12}:${minutes}:${seconds} ${suffix}`;
};

export const formatDelta = (startDeltaSeconds: number, distanceDeltaMeters: string): string => {
  const miles = (parseFloat(distanceDeltaMeters) / 1609.34).toFixed(2);
  return `started ${startDeltaSeconds}s apart · ${miles} mi apart`;
};
