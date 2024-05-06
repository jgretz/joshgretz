import {HomeIcon} from '@radix-ui/react-icons';
import {Link} from '@remix-run/react';

export function Header() {
  return (
    <header className="flex items-center justify-between px-4 py-2 md:py-4">
      <div className="flex items-center space-x-4">
        <Link className="flex items-center space-x-2" to="/">
          <HomeIcon className="h-6 w-6" />
        </Link>
      </div>
    </header>
  );
}
