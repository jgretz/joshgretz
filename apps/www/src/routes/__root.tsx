import {HeadContent, Outlet, Scripts, createRootRoute, useLocation} from '@tanstack/react-router';
import {DefaultCatchBoundary} from '../components/default-catch-boundary';
import {GlobalPendingIndicator} from '../components/global-pending-indicator';
import {Nav} from '../components/layout/nav';
import {NotFound} from '../components/not-found';
import '../globals.css';

export const Route = createRootRoute({
  head: () => ({
    meta: [{charSet: 'utf-8'}, {name: 'viewport', content: 'width=device-width, initial-scale=1'}],
    links: [
      {rel: 'icon', type: 'image/png', href: '/favicon.png'},
      {rel: 'preconnect', href: 'https://fonts.googleapis.com'},
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&family=DM+Sans:wght@400;500;600&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap',
      },
    ],
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

function RootDocument({children}: {children: React.ReactNode}) {
  const {pathname} = useLocation();
  const hideNav = pathname === '/print-resume';

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <GlobalPendingIndicator />
        {!hideNav && <Nav />}
        {children}
        <Scripts />
      </body>
    </html>
  );
}
