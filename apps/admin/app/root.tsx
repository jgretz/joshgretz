import type {LoaderFunctionArgs} from '@remix-run/node';
import {Links, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData} from '@remix-run/react';

import './globals.css';

import {ErrorDisplay} from './components/error';
import {GlobalPendingIndicator} from './components/global-pending-indicator';
import {Header} from './components/header';

import Login from './components/login';
import {getUser} from './services/auth/getUser';
import {getClientEnv} from './utils/env.server';

export async function loader({request}: LoaderFunctionArgs) {
  const user = await getUser(request);

  return {
    user,

    env: getClientEnv(),
  };
}

function App({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <GlobalPendingIndicator />
        <Header />
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function Root() {
  const {user, env} = useLoaderData<typeof loader>();

  const Content = user ? <Outlet /> : <Login />;

  return (
    <App>
      {Content}

      <script
        dangerouslySetInnerHTML={{
          __html: `process = { env: ${JSON.stringify(env)}};`,
        }}
      />
    </App>
  );
}

export function ErrorBoundary() {
  return (
    <App>
      <ErrorDisplay />
    </App>
  );
}
