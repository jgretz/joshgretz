import type {LinksFunction} from '@remix-run/node';
import {Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration} from '@remix-run/react';
import {Suspense, lazy} from 'react';

import stylesheet from '~/tailwind.css';
import Bar from './components/bar';

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
        <Bar />
        <div className="absolute z-0 top-[240px] left-0 sm:top-0 sm:left-[200px] sm:h-full">
          <Outlet />
        </div>
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
