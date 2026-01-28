import {useRouterState} from '@tanstack/react-router';

import {cn} from '../lib/styles';

export function GlobalPendingIndicator() {
  const isLoading = useRouterState({select: (s) => s.status === 'pending'});

  return (
    <div className={cn('fixed top-0 left-0 right-0', {hidden: !isLoading})}>
      <div className="h-0.5 w-full bg-muted overflow-hidden">
        <div className="animate-progress w-full h-full bg-muted-foreground origin-left-right" />
      </div>
    </div>
  );
}
