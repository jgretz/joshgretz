import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from '@tanstack/react-router';
import Bar from '../components/side/bar';
import { GlobalPendingIndicator } from '../components/global-pending-indicator';
import { DefaultCatchBoundary } from '../components/default-catch-boundary';
import { NotFound } from '../components/not-found';
import '../globals.css';

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    ],
    links: [{ rel: 'icon', type: 'image/png', href: '/favicon.png' }],
  }),
  errorComponent: (props) => {
    return (
      <RootDocument>
        <DefaultCatchBoundary {...props} />
      </RootDocument>
    );
  },
  notFoundComponent: () => <NotFound />,
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <GlobalPendingIndicator />
        <div className="side absolute left-0 top-0 z-10 w-full bg-black text-white sm:fixed sm:h-full sm:w-[200px]">
          <Bar />
        </div>
        <div className="absolute left-0 top-[240px] z-0 w-full bg-background text-black sm:top-0 sm:min-h-screen sm:pl-[200px]">
          {children}
        </div>
        <Scripts />
      </body>
    </html>
  );
}
