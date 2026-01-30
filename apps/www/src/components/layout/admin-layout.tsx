import {Link, useLocation, useNavigate} from '@tanstack/react-router';
import {type PropsWithChildren, useCallback} from 'react';
import {cn} from '../../lib/styles';
import {clearUserSession} from '../../services/auth';

type NavItem = {
  label: string;
  to: string;
  children?: {label: string; to: string}[];
};

const navItems: NavItem[] = [
  {label: 'Dashboard', to: '/admin'},
  {
    label: 'Strava',
    to: '/admin/strava',
    children: [
      {label: 'Connect', to: '/admin/strava/connect'},
      {label: 'Import', to: '/admin/strava/import'},
    ],
  },
  {label: 'Personal Records', to: '/admin/prs'},
  {label: 'Future Races', to: '/admin/races'},
  {label: 'Streak', to: '/admin/streak'},
  {label: 'Activities', to: '/admin/activities'},
  {label: 'Jobs', to: '/admin/jobs'},
];

const isActive = (pathname: string, to: string) =>
  to === '/admin' ? pathname === '/admin' || pathname === '/admin/' : pathname.startsWith(to);

type AdminLayoutProps = PropsWithChildren<{
  title: string;
}>;

export const AdminLayout = ({title, children}: AdminLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;

  const handleLogout = useCallback(() => {
    clearUserSession();
    navigate({to: '/admin/login'});
  }, [navigate]);

  return (
    <div className="flex min-h-screen">
      <aside className="fixed left-0 top-0 flex h-screen w-60 flex-col border-r border-warm-200 bg-warm-50">
        <div className="border-b border-warm-200 px-6 py-5">
          <Link to="/admin" className="font-serif text-xl text-warm-800">
            Admin
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const active = isActive(pathname, item.to);
              const expanded = active && item.children;

              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className={cn(
                      'block rounded-md px-3 py-2 text-sm font-medium transition-colors',
                      active
                        ? 'bg-warm-200 text-warm-900'
                        : 'text-warm-600 hover:bg-warm-100 hover:text-warm-800',
                    )}
                  >
                    {item.label}
                  </Link>
                  {expanded && (
                    <ul className="ml-3 mt-1 space-y-1 border-l border-warm-200 pl-3">
                      {item.children!.map((child) => (
                        <li key={child.to}>
                          <Link
                            to={child.to}
                            className={cn(
                              'block rounded-md px-3 py-1.5 text-sm transition-colors',
                              pathname.startsWith(child.to)
                                ? 'font-medium text-warm-900'
                                : 'text-warm-500 hover:text-warm-800',
                            )}
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-warm-200 px-3 py-4">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full rounded-md px-3 py-2 text-left text-sm text-warm-600 transition-colors hover:bg-warm-100 hover:text-warm-800"
          >
            Logout
          </button>
        </div>
      </aside>

      <main className="ml-60 flex-1 px-8 py-10">
        <h1 className="mb-8 font-serif text-3xl text-warm-800">{title}</h1>
        {children}
      </main>
    </div>
  );
};
