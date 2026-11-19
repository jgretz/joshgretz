import {describe, it, expect} from 'bun:test';
import {Elysia} from 'elysia';
import {parseStravaWebhookBody, stravaWebhookEventHook} from '../src/strava/webhook-event';

// Above 2^53: JSON.parse rounds this to 3546500041732922400.
const BIG_ID = '3546500041732922368';

function eventBody(overrides: Record<string, string> = {}): string {
  const fields = {
    object_type: '"activity"',
    object_id: BIG_ID,
    aspect_type: '"create"',
    owner_id: BIG_ID,
    subscription_id: '120475',
    event_time: '1516126040',
    ...overrides,
  };
  const pairs = Object.entries(fields).map(([key, value]) => `"${key}":${value}`);
  return `{${pairs.join(',')}}`;
}

function echoApp() {
  return new Elysia().post('/', ({body}) => body, stravaWebhookEventHook);
}

function post(app: ReturnType<typeof echoApp>, body: string) {
  return app.handle(
    new Request('http://localhost/', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body,
    }),
  );
}

describe('parseStravaWebhookBody', function () {
  it('should keep a 19-digit object_id exact when parsing the raw body', function () {
    const event = parseStravaWebhookBody(eventBody()) as Record<string, unknown>;

    expect(event.object_id).toBe(BIG_ID);
  });

  it('should keep a 19-digit owner_id exact when parsing the raw body', function () {
    const event = parseStravaWebhookBody(eventBody()) as Record<string, unknown>;

    expect(event.owner_id).toBe(BIG_ID);
  });

  it('should tolerate whitespace around the colon', function () {
    const raw = eventBody().replace(`"object_id":${BIG_ID}`, `"object_id" :  ${BIG_ID}`);

    const event = parseStravaWebhookBody(raw) as Record<string, unknown>;

    expect(event.object_id).toBe(BIG_ID);
  });

  it('should ignore a same-named key that does not match the top-level value', function () {
    const raw = eventBody({object_type: '{"object_id":42}', object_id: '7'});

    const event = parseStravaWebhookBody(raw) as Record<string, unknown>;

    expect(event.object_id).toBe(7);
  });

  it('should leave the other numeric fields as numbers', function () {
    const event = parseStravaWebhookBody(eventBody()) as Record<string, unknown>;

    expect([event.subscription_id, event.event_time]).toEqual([120475, 1516126040]);
  });
});

describe('stravaWebhookEventHook', function () {
  it('should deliver the exact 19-digit ids to the route handler', async function () {
    const response = await post(echoApp(), eventBody());

    expect(await response.json()).toMatchObject({object_id: BIG_ID, owner_id: BIG_ID});
  });

  it('should reject an event whose id is not an integer', async function () {
    const response = await post(echoApp(), eventBody({object_id: '"abc"'}));

    expect(response.status).toBe(422);
  });
});
