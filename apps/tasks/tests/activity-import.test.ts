import {describe, it, expect, beforeAll, afterAll, beforeEach, mock} from 'bun:test';
import type {ActivityImportPayload} from '../src/handlers/activity-import';

process.env.TASK_API_KEY ??= 'test-key';

let processJob: (type: string, payload: unknown) => Promise<unknown>;
const originalFetch = global.fetch;
let requestedUrls: string[];

beforeAll(async function () {
  ({processJob} = await import('../src/handlers'));
});

afterAll(function () {
  global.fetch = originalFetch;
});

beforeEach(function () {
  requestedUrls = [];
  // 404 from the delete route means "not stored", so the handler stops after one request.
  global.fetch = mock(async (input: RequestInfo | URL) => {
    requestedUrls.push(String(input));
    return new Response('', {status: 404});
  }) as unknown as typeof fetch;
});

function deletePayload(activityId: string | number): ActivityImportPayload {
  return {user_id: 1, activity_id: activityId, aspect_type: 'delete'};
}

describe('activity-import job', function () {
  it('should delete by the string id when a legacy job carries a numeric activity_id', async function () {
    await processJob('activity-import', deletePayload(21034466191));

    expect(requestedUrls).toEqual([
      expect.stringMatching(/\/running\/activities\/by-strava-id\/21034466191$/),
    ]);
  });

  it('should delete by the exact id when the payload carries a 19-digit string', async function () {
    await processJob('activity-import', deletePayload('3546500041732922368'));

    expect(requestedUrls).toEqual([
      expect.stringMatching(/\/running\/activities\/by-strava-id\/3546500041732922368$/),
    ]);
  });
});
