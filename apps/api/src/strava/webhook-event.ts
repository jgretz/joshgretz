import {t} from 'elysia';

// Strava ids may be 64-bit after June 2027, and JSON.parse rounds integers above 2^53.
// Webhook events carry no id_str, so these fields are read as digits from the raw body.
const LOSSLESS_ID_FIELDS = ['object_id', 'owner_id'] as const;

const DIGITS = '^[0-9]+$';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function rawDigitsFor(raw: string, field: string): string | undefined {
  return raw.match(new RegExp(`"${field}"\\s*:\\s*([0-9]+)`))?.[1];
}

// The digits only replace the parsed value when both denote the same (possibly rounded)
// number, so a same-named key elsewhere in the body can never be picked up. On a mismatch
// the field stays numeric and the string schema rejects the event.
function withExactId(raw: string, event: Record<string, unknown>, field: string) {
  const digits = rawDigitsFor(raw, field);
  return digits !== undefined && Number(digits) === event[field] ? {[field]: digits} : {};
}

export function parseStravaWebhookBody(raw: string): unknown {
  const event: unknown = JSON.parse(raw);
  if (!isRecord(event)) return event;

  return LOSSLESS_ID_FIELDS.reduce(
    (acc, field) => ({...acc, ...withExactId(raw, event, field)}),
    event,
  );
}

export const stravaWebhookEventHook = {
  parse: async function ({request}: {request: Request}) {
    return parseStravaWebhookBody(await request.text());
  },
  body: t.Object({
    object_type: t.String(),
    object_id: t.String({pattern: DIGITS}),
    aspect_type: t.String(),
    owner_id: t.String({pattern: DIGITS}),
    subscription_id: t.Number(),
    event_time: t.Number(),
  }),
};
