import type {LinksFunction} from '@remix-run/node';
import {Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration} from '@remix-run/react';

import stylesheet from '~/tailwind.css';
import Bar from './components/bar';

export const links: LinksFunction = () => [{rel: 'stylesheet', href: stylesheet}];

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
        <div className="z-10 absolute sm:fixed top-0 left-0 w-full sm:w-[200px] sm:h-full">
          <Bar />
        </div>
        <div className="z-0 absolute top-[240px] sm:top-0 left-0 sm:left-[200px] sm:min-h-screen">
          <Outlet />
        </div>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
