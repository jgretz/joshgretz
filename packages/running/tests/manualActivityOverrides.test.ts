import {describe, expect, it} from 'bun:test';
import {
  chooseSurvivor,
  describeManualOverrides,
  manualOverridesFor,
} from '../src/services/manualActivityOverrides';
import type {ManualOverrideSource} from '../src/Types';
import {makePair} from './helpers/duplicateCandidates';

const makeSource = (overrides: Partial<ManualOverrideSource> = {}): ManualOverrideSource => ({
  start_lat: null,
  start_lng: null,
  location_city: null,
  location_state: null,
  location_country: null,
  featured_marathon: false,
  ...overrides,
});

describe('manualOverridesFor', function () {
  it('should treat a featured race as an override on its own', function () {
    const result = manualOverridesFor(makeSource({featured_marathon: true}));

    expect(result).toEqual({featured_marathon: true});
  });

  it('should not treat a state as an override when the row has GPS to re-geocode from', function () {
    const result = manualOverridesFor(
      makeSource({start_lat: '43.6', start_lng: '-72.6', location_state: 'Vermont'}),
    );

    expect(result).toBeNull();
  });

  it('should treat a state as an override when the row has no GPS', function () {
    const result = manualOverridesFor(
      makeSource({location_state: 'Vermont', location_city: 'Woodstock'}),
    );

    expect(result).toEqual({location_city: 'Woodstock', location_state: 'Vermont'});
  });

  it('should omit location fields the row left empty rather than carrying a blank', function () {
    const result = manualOverridesFor(makeSource({location_state: 'Vermont'}));

    expect(Object.keys(result ?? {})).toEqual(['location_state']);
  });

  it('should treat empty strings as unset', function () {
    const result = manualOverridesFor(makeSource({location_state: '', location_city: ''}));

    expect(result).toBeNull();
  });

  it('should require both coordinates before calling a row GPS-backed', function () {
    const result = manualOverridesFor(makeSource({start_lat: '43.6', location_state: 'Vermont'}));

    expect(result).toEqual({location_state: 'Vermont'});
  });

  it('should return null when nothing is hand-set', function () {
    const result = manualOverridesFor(makeSource());

    expect(result).toBeNull();
  });
});

describe('describeManualOverrides', function () {
  it('should name each carried value the way the admin warning does', function () {
    const description = describeManualOverrides({
      featured_marathon: true,
      location_state: 'Vermont',
      location_city: 'Woodstock',
    });

    expect(description).toBe('featured race, state "Vermont", city "Woodstock"');
  });
});

describe('chooseSurvivor', function () {
  it('should take the other side when the activity is side a', function () {
    const survivor = chooseSurvivor([makePair(10, 20, 30)], 10);

    expect(survivor?.id).toBe(20);
  });

  it('should take the other side when the activity is side b', function () {
    const survivor = chooseSurvivor([makePair(10, 20, 30)], 20);

    expect(survivor?.id).toBe(10);
  });

  it('should prefer the copy that started closest to the deleted one', function () {
    const survivor = chooseSurvivor([makePair(10, 30, 240), makePair(10, 20, 60)], 10);

    expect(survivor?.id).toBe(20);
  });

  it('should break a tied start delta on the lower id', function () {
    const survivor = chooseSurvivor([makePair(10, 30, 60), makePair(10, 20, 60)], 10);

    expect(survivor?.id).toBe(20);
  });

  it('should return null when no pair contains the activity', function () {
    const survivor = chooseSurvivor([makePair(10, 20, 60)], 99);

    expect(survivor).toBeNull();
  });

  it('should return null when there are no candidates at all', function () {
    const survivor = chooseSurvivor([], 10);

    expect(survivor).toBeNull();
  });
});
