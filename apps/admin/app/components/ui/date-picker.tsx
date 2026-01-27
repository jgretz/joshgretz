'use client';

import {CalendarIcon} from '@radix-ui/react-icons';
import {format, formatISO, parseISO} from 'date-fns';

import {Button} from '@admin/components/ui/button';
import {Calendar} from '@admin/components/ui/calendar';
import {Popover, PopoverContent, PopoverTrigger} from '@admin/components/ui/popover';
import {cn} from '@admin/lib/styles';
import {type FieldMetadata, useInputControl} from '@conform-to/react';
import {useCallback, useState} from 'react';

interface Props {
  meta: FieldMetadata<Date>;
}

export function DatePicker({meta}: Props) {
  const control = useInputControl<string>(meta);
  const [date, setDate] = useState(control.value ? new Date(parseISO(control.value)) : undefined);

  const handleSelect = useCallback(
    (date: Date | undefined) => {
      setDate(date);
      control.change(date ? formatISO(date) : undefined);
    },
    [control],
  );

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
        <Calendar mode="single" selected={date} onSelect={handleSelect} initialFocus />
      </PopoverContent>
    </Popover>
  );
}
