import * as Sentry from '@sentry/remix';

export function init() {
  Sentry.init({
    dsn: ENV.SENTRY_DSN,
    environment: ENV.MODE,
    tracesSampleRate: 1,
    integrations: [new Sentry.Integrations.Http({ tracing: true })],
  });
}
