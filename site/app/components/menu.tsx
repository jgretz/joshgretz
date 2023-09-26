import {Link, useMatch} from '@remix-run/react';
import {cn} from '~/lib/utils';

interface MenuItemProps {
  to: string;
  children: React.ReactNode;
}

function MenuItem({to, children}: MenuItemProps) {
  const match = useMatch(to);
  const classNames = cn('mx-2 my-1', match ? 'font-bold text-primary' : '');

  return (
    <li className={classNames}>
      <Link to={to}>{children}</Link>
    </li>
  );
}

export default function Menu() {
  return (
    <ul className="w-2/3 flex flex-row sm:flex-col justify-center items-center">
      <MenuItem to="/">About</MenuItem>
      <MenuItem to="/resume">Resume</MenuItem>
      <MenuItem to="/running">Running</MenuItem>
      <MenuItem to="/thoughts">Thoughts</MenuItem>
    </ul>
  );
}
