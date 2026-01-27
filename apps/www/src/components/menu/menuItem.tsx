import { Link } from '@tanstack/react-router';

interface MenuItemProps {
  to: string;
  children: React.ReactNode;
}

export default function MenuItem({ to, children }: MenuItemProps) {
  return (
    <li className="mx-2 my-1">
      <Link
        to={to}
        activeProps={{ className: 'font-bold text-primary' }}
        activeOptions={{ exact: true }}
      >
        {children}
      </Link>
    </li>
  );
}
