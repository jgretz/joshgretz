import {beforeEach, describe, expect, it} from 'bun:test';
import {GetContainer} from 'injectx';
import {
  DUPLICATE_MATCH_DEFAULTS,
  findDuplicateActivityCandidates,
} from '../src/query/findDuplicateActivityCandidates';
import {captureQuery} from './helpers/captureQuery';

// What the tolerances mean is only observable in the statement that reaches Postgres: both
// numbers are plain `number`s, so transposing the percentage and the metre floor typechecks
// cleanly and quietly changes which pairs are reported.
describe('findDuplicateActivityCandidates', function () {
  beforeEach(function () {
    GetContainer().dependencies.clear();
  });

  it('should bind the default tolerances when none are supplied', async function () {
    const captured = captureQuery();

    await findDuplicateActivityCandidates({userId: 7});

    expect(captured.params()).toEqual([
      7,
      7,
      DUPLICATE_MATCH_DEFAULTS.startWindowSeconds,
      DUPLICATE_MATCH_DEFAULTS.distanceToleranceMeters,
      DUPLICATE_MATCH_DEFAULTS.distanceTolerancePct,
    ]);
  });

  it('should bind each override in place of its default', async function () {
    const captured = captureQuery();

    await findDuplicateActivityCandidates({
      userId: 7,
      startWindowSeconds: 90,
      distanceTolerancePct: 1,
      distanceToleranceMeters: 25,
    });

    expect(captured.params()).toEqual([7, 7, 90, 25, 1]);
  });

  it('should apply the metre floor and the percentage as a GREATEST of the two', async function () {
    const captured = captureQuery();

    await findDuplicateActivityCandidates({userId: 7});

    // The floor is what keeps a short run from being held to 5% of a small number, so it has to
    // widen the window rather than cap it.
    expect(captured.sql()).toContain('GREATEST($4::numeric, $5::numeric / 100 * GREATEST(');
  });

  it('should report each pair once by ordering the two sides on id', async function () {
    const captured = captureQuery();

    await findDuplicateActivityCandidates({userId: 7});

    expect(captured.sql()).toContain('"a"."id" < "b"."id"');
  });

  it('should require a local start date and a distance on both sides', async function () {
    const captured = captureQuery();

    await findDuplicateActivityCandidates({userId: 7});

    const sql = captured.sql();
    // A row with no local start date is excluded deliberately: the sanctioned delete route
    // answers 404 for such a row *after* removing it, so listing it would offer a delete button
    // that destroys the activity and skips the recalcs.
    expect(sql).toContain('"a"."start_date_local" is not null');
    expect(sql).toContain('"b"."start_date_local" is not null');
    expect(sql).toContain('"a"."distance" is not null');
    expect(sql).toContain('"b"."distance" is not null');
  });

  it('should never match on GPS, which is frequently null on large uploads', async function () {
    const captured = captureQuery();

    await findDuplicateActivityCandidates({userId: 7});

    // start_lat/start_lng are selected for display; they must not appear in the join or filter.
    expect(captured.sql().split(' from ')[1]).not.toContain('start_lat');
  });

  it('should return the newest pairs first', async function () {
    const captured = captureQuery();

    await findDuplicateActivityCandidates({userId: 7});

    expect(captured.sql()).toContain(
      'order by LEAST("a"."start_date_local", "b"."start_date_local") DESC',
    );
  });
});
