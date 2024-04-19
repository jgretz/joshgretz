import { cssBundleHref } from '@remix-run/css-bundle';
import {
  json,
  type HeadersFunction,
  type LinksFunction,
  type MetaFunction,
  type LoaderFunctionArgs,
} from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react';
import { withSentry } from '@sentry/remix';
import { AuthenticityTokenProvider } from 'remix-utils/csrf/react';

import { ClientHintCheck, getHints } from './components/client-hints.tsx';
import { GeneralErrorBoundary } from './components/error-boundary.tsx';
import Bar from './components/side/bar.tsx';
import { Toaster } from './components/ui/toaster.tsx';
import tailwindStylesheetUrl from './styles/tailwind.css';
import { csrf } from './utils/csrf.server.ts';
import { getClientEnv } from './utils/env.server.ts';
import { combineHeaders, getDomainUrl } from './utils/misc.ts';
import { useNonce } from './utils/nonce-provider.ts';
import { makeTimings /*time*/ } from './utils/timing.server.ts';
import { getToast } from './utils/toast.server.ts';

export const links: LinksFunction = () => {
  return [
    // Preload CSS as a resource to avoid render blocking
    { rel: 'preload', href: tailwindStylesheetUrl, as: 'style' },
    cssBundleHref ? { rel: 'preload', href: cssBundleHref, as: 'style' } : null,

    { rel: 'manifest', href: '/site.webmanifest' },

    { rel: 'stylesheet', href: tailwindStylesheetUrl },
    cssBundleHref ? { rel: 'stylesheet', href: cssBundleHref } : null,
  ].filter(Boolean);
};

export const meta: MetaFunction = () => {
  return [{ title: 'Josh Gretz' }, { name: 'description', content: '' }];
};

export const headers: HeadersFunction = ({ loaderHeaders }) => {
  const headers = {
    'Server-Timing': loaderHeaders.get('Server-Timing') ?? '',
  };
  return headers;
};

export async function loader({ request }: LoaderFunctionArgs) {
  const timings = makeTimings('root loader');

  const { toast, headers: toastHeaders } = await getToast(request);
  const [csrfToken, csrfCookieHeader] = await csrf.commitToken();

  return json(
    {
      // session,
      requestInfo: {
        hints: getHints(request),
        origin: getDomainUrl(request),
        path: new URL(request.url).pathname,
        session: {},
      },
      ENV: getClientEnv(),
      toast,
      csrfToken,
    },
    {
      headers: combineHeaders(
        new Headers({ 'Server-Timing': timings.toString() }),
        toastHeaders,
        csrfCookieHeader ? { 'set-cookie': csrfCookieHeader } : null,
      ),
    },
  );
}

interface DocumentArgs {
  children: React.ReactNode;
  nonce: string;
  env?: Record<string, string>;
}

function Document({ children, nonce, env }: DocumentArgs) {
  return (
    <html lang="en">
      <head>
        <ClientHintCheck nonce={nonce} />
        <Meta />

        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />

        <Links />
      </head>
      <body>
        {children}
        <script
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(env)}`,
          }}
        />
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
        <LiveReload nonce={nonce} />
      </body>
    </html>
  );
}

function App() {
  const nonce = useNonce();
  const data = useLoaderData<typeof loader>();

  return (
    <AuthenticityTokenProvider token={data.csrfToken}>
      <Document nonce={nonce} env={data.ENV}>
        <div className="side absolute left-0 top-0 z-10 w-full bg-background text-white sm:fixed sm:h-full sm:w-[200px]">
          <Bar />
        </div>
        <div className="absolute left-0 top-[240px] z-0 w-full bg-background text-black sm:top-0 sm:min-h-screen sm:pl-[200px]">
          <Outlet />
        </div>

        <Toaster />
      </Document>
    </AuthenticityTokenProvider>
  );
}

export function ErrorBoundary() {
  // the nonce doesn't rely on the loader so we can access that
  const nonce = useNonce();

  // NOTE: you cannot use useLoaderData in an ErrorBoundary because the loader
  // likely failed to run so we have to do the best we can.
  // We could probably do better than this (it's possible the loader did run).
  // This would require a change in Remix.

  // Just make sure your root route never errors out and you'll always be able
  // to give the user a better UX.

  return (
    <Document nonce={nonce}>
      <GeneralErrorBoundary />
    </Document>
  );
}

export default withSentry(App);
