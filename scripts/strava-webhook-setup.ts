/**
 * Script to register/manage Strava webhook subscription.
 *
 * Usage:
 *   bun run scripts/strava-webhook-setup.ts create <callback_url>
 *   bun run scripts/strava-webhook-setup.ts view
 *   bun run scripts/strava-webhook-setup.ts delete <subscription_id>
 *
 * Environment variables required:
 *   STRAVA_CLIENT_ID
 *   STRAVA_CLIENT_SECRET
 *   STRAVA_WEBHOOK_VERIFY_TOKEN
 */

const STRAVA_API_BASE = 'https://www.strava.com/api/v3';

const clientId = process.env.STRAVA_CLIENT_ID;
const clientSecret = process.env.STRAVA_CLIENT_SECRET;
const verifyToken = process.env.STRAVA_WEBHOOK_VERIFY_TOKEN;

if (!clientId || !clientSecret || !verifyToken) {
  console.error('Missing required environment variables');
  console.error('Required: STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET, STRAVA_WEBHOOK_VERIFY_TOKEN');
  process.exit(1);
}

const command = process.argv[2];

const createSubscription = async (callbackUrl: string) => {
  const response = await fetch(`${STRAVA_API_BASE}/push_subscriptions`, {
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      callback_url: callbackUrl,
      verify_token: verifyToken,
    }),
  });

  const data = await response.json();
  if (response.ok) {
    console.log('Subscription created:', data);
  } else {
    console.error('Failed to create subscription:', data);
  }
};

const viewSubscriptions = async () => {
  const response = await fetch(
    `${STRAVA_API_BASE}/push_subscriptions?client_id=${clientId}&client_secret=${clientSecret}`,
  );

  const data = await response.json();
  console.log('Current subscriptions:', JSON.stringify(data, null, 2));
};

const deleteSubscription = async (subscriptionId: string) => {
  const response = await fetch(`${STRAVA_API_BASE}/push_subscriptions/${subscriptionId}`, {
    method: 'DELETE',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });

  if (response.ok) {
    console.log('Subscription deleted');
  } else {
    const data = await response.json();
    console.error('Failed to delete subscription:', data);
  }
};

switch (command) {
  case 'create': {
    const callbackUrl = process.argv[3];
    if (!callbackUrl) {
      console.error('Usage: bun run scripts/strava-webhook-setup.ts create <callback_url>');
      process.exit(1);
    }
    await createSubscription(callbackUrl);
    break;
  }
  case 'view':
    await viewSubscriptions();
    break;
  case 'delete': {
    const subscriptionId = process.argv[3];
    if (!subscriptionId) {
      console.error('Usage: bun run scripts/strava-webhook-setup.ts delete <subscription_id>');
      process.exit(1);
    }
    await deleteSubscription(subscriptionId);
    break;
  }
  default:
    console.log('Strava Webhook Management');
    console.log('');
    console.log('Commands:');
    console.log('  create <callback_url>  - Register a new webhook subscription');
    console.log('  view                   - View current subscriptions');
    console.log('  delete <id>            - Delete a subscription');
}
