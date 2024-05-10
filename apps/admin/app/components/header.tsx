import {HomeIcon} from '@radix-ui/react-icons';
import {Link, useLoaderData} from '@remix-run/react';
import type {User} from 'users';

interface LoaderData {
  user?: User;
}

export function Header() {
  const loaderData = useLoaderData<LoaderData>();

  if (!loaderData?.user) {
    return null;
  }

  return (
    <header className="flex items-center justify-between px-4 py-2 md:py-4">
      <div className="flex items-center space-x-4">
        <Link className="flex items-center space-x-2" to="/">
          <HomeIcon className="h-6 w-6" />
        </Link>
        <Link className="flex items-center space-x-2" to="/strava">
          Strava
        </Link>
      </div>
    </header>
  );
}
