import {useRouterState} from '@tanstack/react-router';
import {useEffect, useState} from 'react';

export function GlobalPendingIndicator() {
  const isLoading = useRouterState({select: (s) => s.status === 'pending'});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const visible = hydrated ? isLoading : true;

  return (
    <div className={`fixed top-0 left-0 right-0${visible ? '' : ' hidden'}`}>
      <div className="h-0.5 w-full overflow-hidden bg-muted">
        <div className="h-full w-full animate-progress bg-muted-foreground origin-left-right" />
      </div>
    </div>
  );
}
