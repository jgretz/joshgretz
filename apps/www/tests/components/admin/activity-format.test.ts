import {describe, expect, it} from 'bun:test';
import {
  formatDateTime,
  formatDelta,
  formatDistance,
  formatElevation,
  formatTime,
} from '../../../src/components/admin/activity-format';

describe('formatDistance', () => {
  it('should convert metres to miles with two decimals', () => {
    expect(formatDistance('16093.44')).toBe('10.00 mi');
    expect(formatDistance('42195')).toBe('26.22 mi');
  });

  it('should render a dash when the distance is missing', () => {
    expect(formatDistance(null)).toBe('-');
  });
});

describe('formatTime', () => {
  it('should drop the hour segment for sub-hour durations', () => {
    expect(formatTime('125')).toBe('2:05');
  });

  it('should pad minutes and seconds once hours are present', () => {
    expect(formatTime('3725')).toBe('1:02:05');
    expect(formatTime('36000')).toBe('10:00:00');
  });

  it('should round fractional seconds', () => {
    expect(formatTime('59.6')).toBe('1:00');
  });

  it('should render a dash when the duration is missing', () => {
    expect(formatTime(null)).toBe('-');
  });
});

describe('formatElevation', () => {
  it('should convert metres to whole feet', () => {
    expect(formatElevation('100')).toBe('328 ft');
  });

  it('should render a dash when the gain is missing', () => {
    expect(formatElevation(null)).toBe('-');
  });
});

describe('formatDateTime', () => {
  // Postgres renders timestamp columns space separated; the ISO form arrives from the API too.
  it('should format a space-separated Postgres timestamp', () => {
    expect(formatDateTime('2026-07-26 06:04:12')).toBe('Jul 26, 2026, 6:04:12 AM');
  });

  it('should format an ISO timestamp identically', () => {
    expect(formatDateTime('2026-07-26T06:04:12')).toBe('Jul 26, 2026, 6:04:12 AM');
  });

  it('should read the wall clock literally rather than shifting it into the viewer timezone', () => {
    // 23:30 local must stay on the 26th at 11:30 PM whatever TZ the browser is in.
    expect(formatDateTime('2026-07-26 23:30:00')).toBe('Jul 26, 2026, 11:30:00 PM');
  });

  it('should render midnight and noon in 12-hour form', () => {
    expect(formatDateTime('2026-07-26 00:00:00')).toBe('Jul 26, 2026, 12:00:00 AM');
    expect(formatDateTime('2026-07-26 12:00:00')).toBe('Jul 26, 2026, 12:00:00 PM');
  });

  it('should fall back to the date alone when there is no time part', () => {
    expect(formatDateTime('2026-07-26')).toBe('Jul 26, 2026');
  });

  it('should render a dash when the timestamp is missing', () => {
    expect(formatDateTime(null)).toBe('-');
  });

  it('should return the raw value when it is not a timestamp at all', () => {
    expect(formatDateTime('not a date')).toBe('not a date');
  });
});

describe('formatDelta', () => {
  it('should report the start and distance gap between two copies', () => {
    expect(formatDelta(40, '80.50')).toBe('started 40s apart · 0.05 mi apart');
  });

  it('should report a zero gap without dropping either unit', () => {
    expect(formatDelta(0, '0')).toBe('started 0s apart · 0.00 mi apart');
  });
});
