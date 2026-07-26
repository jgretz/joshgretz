import {afterAll, beforeEach, describe, expect, it} from 'bun:test';
import {deleteActivityWithRecalcs} from '../../../src/services/activities/delete-activity-with-recalcs';

const ENV = {apiUrl: 'https://api.test', apiToken: 'token'};
const USER_ID = 7;
const STRAVA_ID = 'coros-1';

type Call = {
  url: string;
  method: string;
  body: {type: string; payload: {user_id: number; dates?: string[]}} | null;
};

type Stub = {
  deleteStatus?: number;
  deleteBody?: unknown;
  jobStatusByType?: Record<string, number>;
};

let calls: Call[] = [];
const originalFetch = global.fetch;

// The whole point of this module is the sequence of HTTP calls it makes, so the boundary being
// mocked is fetch itself rather than anything internal.
const stubFetch = ({deleteStatus = 200, deleteBody, jobStatusByType = {}}: Stub) => {
  global.fetch = (async (input: string, init?: RequestInit) => {
    const url = String(input);
    const method = init?.method ?? 'GET';
    const body = init?.body ? JSON.parse(String(init.body)) : null;
    calls.push({url, method, body});

    if (url.includes('/running/activities/by-strava-id/')) {
      return new Response(
        deleteStatus === 200
          ? JSON.stringify(deleteBody ?? {success: true, start_date: '2026-07-20 06:00:40'})
          : 'Not found',
        {status: deleteStatus},
      );
    }

    const status = jobStatusByType[body?.type] ?? 200;
    return status === 200
      ? new Response(JSON.stringify({id: 100 + calls.length}), {status})
      : new Response('queue is down', {status});
  }) as unknown as typeof fetch;
};

const jobCalls = () => calls.filter((call) => call.url.endsWith('/jobs'));

beforeEach(() => {
  calls = [];
  global.fetch = originalFetch;
});

afterAll(() => {
  global.fetch = originalFetch;
});

describe('deleteActivityWithRecalcs', () => {
  it('should delete through the sanctioned by-strava-id route', async () => {
    stubFetch({});

    await deleteActivityWithRecalcs(ENV, USER_ID, STRAVA_ID);

    expect(calls[0]).toMatchObject({
      url: 'https://api.test/running/activities/by-strava-id/coros-1',
      method: 'DELETE',
    });
  });

  it('should url-encode a strava id that needs it', async () => {
    stubFetch({});

    await deleteActivityWithRecalcs(ENV, USER_ID, 'a/b?c');

    expect(calls[0]?.url).toBe('https://api.test/running/activities/by-strava-id/a%2Fb%3Fc');
  });

  it('should enqueue exactly the three post-delete recalcs', async () => {
    stubFetch({});

    const {jobIds} = await deleteActivityWithRecalcs(ENV, USER_ID, STRAVA_ID);

    expect(jobCalls().map((call) => call.body?.type)).toEqual([
      'streak-update',
      'state-stats-update',
      'daily-stats-update',
    ]);
    expect(jobIds).toHaveLength(3);
  });

  it('should scope every recalc to the user and the daily one to the deleted date', async () => {
    stubFetch({});

    await deleteActivityWithRecalcs(ENV, USER_ID, STRAVA_ID);

    expect(jobCalls().map((call) => call.body?.payload)).toEqual([
      {user_id: USER_ID},
      {user_id: USER_ID},
      {user_id: USER_ID, dates: ['2026-07-20']},
    ]);
  });

  it('should reduce an ISO start_date to a bare date as well', async () => {
    stubFetch({deleteBody: {success: true, start_date: '2026-07-20T06:00:40.000Z'}});

    await deleteActivityWithRecalcs(ENV, USER_ID, STRAVA_ID);

    expect(jobCalls()[2]?.body?.payload.dates).toEqual(['2026-07-20']);
  });

  it('should return the start date the API reported', async () => {
    stubFetch({});

    const result = await deleteActivityWithRecalcs(ENV, USER_ID, STRAVA_ID);

    expect(result.start_date).toBe('2026-07-20 06:00:40');
  });

  it('should surface a 404 as an error rather than a silent success', async () => {
    stubFetch({deleteStatus: 404});

    await expect(deleteActivityWithRecalcs(ENV, USER_ID, STRAVA_ID)).rejects.toThrow(
      /returned 404 from the delete/,
    );
  });

  it('should not enqueue anything when the delete fails', async () => {
    stubFetch({deleteStatus: 500});

    await expect(deleteActivityWithRecalcs(ENV, USER_ID, STRAVA_ID)).rejects.toThrow(/500/);
    expect(jobCalls()).toHaveLength(0);
  });

  it('should report stale aggregates when a recalc job cannot be queued', async () => {
    stubFetch({jobStatusByType: {'daily-stats-update': 503}});

    await expect(deleteActivityWithRecalcs(ENV, USER_ID, STRAVA_ID)).rejects.toThrow(
      /aggregates are still stale.*daily-stats-update/s,
    );
  });

  it('should still attempt every recalc when one of them fails', async () => {
    stubFetch({jobStatusByType: {'streak-update': 503}});

    await expect(deleteActivityWithRecalcs(ENV, USER_ID, STRAVA_ID)).rejects.toThrow();
    expect(jobCalls()).toHaveLength(3);
  });
});
