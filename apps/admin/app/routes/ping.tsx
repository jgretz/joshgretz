import {useCallback, useState} from 'react';
import {Button} from '@admin/components/ui/button';
import ping from '@admin/services/joshgretz-api/ping/ping';
import {formatRelative} from 'date-fns';

export default function Ping() {
  const [lastPing, setLastPing] = useState<Date | undefined>(undefined);

  const handleClick = useCallback(async () => {
    const response = await ping();

    if (response.data?.payload.alive) {
      setLastPing(new Date(response.data.payload.timestamp));
    }
  }, [ping]);

  return (
    <div>
      <Button onClick={handleClick}>Ping</Button>
      <h1>{lastPing ? formatRelative(lastPing, new Date()) : 'No Ping Yet'}</h1>
    </div>
  );
}
