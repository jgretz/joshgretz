import {cn} from '@admin/lib/styles';
import {type ReactNode} from 'react';

interface Props {
  className?: string;
  children: ReactNode;
}

export function Page({className, children}: Props) {
  const classes = cn(
    'p-5 min-h-screen w-full max-w-7xl sm:flex sm:flex-col sm:justify-center',
    className,
  );

  return <div className={classes}>{children}</div>;
}
