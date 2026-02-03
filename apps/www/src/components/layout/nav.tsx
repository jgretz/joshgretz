import {Link, useMatches} from '@tanstack/react-router';
import {cn} from '../../lib/styles';

const navItems = [
  {label: 'About', href: '/'},
  {label: 'Resume', href: '/resume'},
  {label: 'ReadMe', href: '/readme'},
  {label: 'Running', href: '/running'},
];

export const Nav = () => {
  const matches = useMatches();
  const currentPath = matches[matches.length - 1]?.pathname ?? '/';

  return (
    <nav className="fixed inset-x-0 top-0 z-50 flex items-center justify-end bg-nav-fade px-6 py-6 md:px-12">
      <div className="flex gap-8">
        {navItems.map((item) => {
          const isActive = currentPath === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'border-b-2 pb-1 font-sans text-sm transition-colors',
                isActive
                  ? 'border-warm-600 text-warm-600'
                  : 'border-transparent text-warm-700 hover:text-warm-600',
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
