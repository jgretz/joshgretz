import type {LinksFunction} from '@remix-run/node';
import {Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration} from '@remix-run/react';
import {Suspense, lazy} from 'react';

import stylesheet from '~/tailwind.css';
import Card from './components/card';

export const links: LinksFunction = () => [{rel: 'stylesheet', href: stylesheet}];

const RemixDevTools =
  process.env.NODE_ENV === 'development' ? lazy(() => import('remix-development-tools')) : null;

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />

        <Meta />
        <Links />
      </head>
      <body>
        <Card />
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        {RemixDevTools ? (
          <Suspense>
            <RemixDevTools />
          </Suspense>
        ) : null}
      </body>
    </html>
  );
}
