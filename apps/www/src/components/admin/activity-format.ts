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

// The same divisor the aggregates use, so a mileage read off this page matches the streak and
// daily-stats numbers rather than drifting from them.
const METERS_PER_MILE = 1609.344;
const FEET_PER_METER = 3.28084;

export const formatDistance = (meters: string | null): string => {
  if (!meters) return '-';
  return `${(parseFloat(meters) / METERS_PER_MILE).toFixed(2)} mi`;
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

export const formatElevation = (meters: string | null): string => {
  if (!meters) return '-';
  return `${Math.round(parseFloat(meters) * FEET_PER_METER)} ft`;
};

// Read from the string parts rather than through `Date`, because these columns already hold the
// runner's wall clock and must not be shifted into the viewer's timezone: `new Date('2026-07-26')`
// is UTC midnight, which renders as the 25th anywhere west of Greenwich.
const parseTimestamp = (timestamp: string): {date: string; time: string | null} | null => {
  const match = TIMESTAMP.exec(timestamp.trim());
  if (!match) return null;

  const [, year, month, day, hours, minutes, seconds] = match;
  // A malformed month ("00", "13") still has to render something rather than "undefined".
  const monthName = MONTHS[parseInt(month, 10) - 1] ?? month;
  const date = `${monthName} ${parseInt(day, 10)}, ${year}`;

  if (!hours) return {date, time: null};

  const hour24 = parseInt(hours, 10);
  const suffix = hour24 >= 12 ? 'PM' : 'AM';
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;

  return {date, time: `${hour12}:${minutes}:${seconds} ${suffix}`};
};

export const formatDate = (timestamp: string | null): string => {
  if (!timestamp) return '-';
  return parseTimestamp(timestamp)?.date ?? timestamp;
};

// Telling two recordings of the same run apart needs seconds, so the duplicates view wants the
// time alongside the date.
export const formatDateTime = (timestamp: string | null): string => {
  if (!timestamp) return '-';

  const parsed = parseTimestamp(timestamp);
  if (!parsed) return timestamp;

  return parsed.time ? `${parsed.date}, ${parsed.time}` : parsed.date;
};

export const formatDelta = (startDeltaSeconds: number, distanceDeltaMeters: string): string => {
  const miles = (parseFloat(distanceDeltaMeters) / METERS_PER_MILE).toFixed(2);
  return `started ${startDeltaSeconds}s apart · ${miles} mi apart`;
};
