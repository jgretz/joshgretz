import { type ReactNode } from 'react';
import { cn } from '~/styles/extended-theme.ts';

interface Props {
  id?: string;
  className?: string;
  children: ReactNode;
}

export default function Section({ id, className, children }: Props) {
  const classes = cn('px-5 flex items-center justify-center min-h-[calc(100vh)]', className);

  return (
    <div id={id} className={classes}>
      {children}
    </div>
  );
}
