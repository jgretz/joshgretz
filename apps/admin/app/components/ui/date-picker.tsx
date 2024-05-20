'use client';

import {format} from 'date-fns';
import {CalendarIcon} from '@radix-ui/react-icons';

import {cn} from '@admin/lib/styles';
import {Button} from '@admin/components/ui/button';
import {Calendar} from '@admin/components/ui/calendar';
import {Popover, PopoverContent, PopoverTrigger} from '@admin/components/ui/popover';

interface Props {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
}

export function DatePicker({date, setDate}: Props) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-[280px] justify-start text-left font-normal',
            !date && 'text-muted-foreground',
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, 'PPP') : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
      </PopoverContent>
    </Popover>
  );
}
