import { useRouteLoaderData } from '@remix-run/react';
import { useCallback, useState } from 'react';
import { type StatsLoaderData } from '../Types.ts';
import ReactActivityCalendarWrapper from './reactactivitycalendarwrapper.tsx';

interface YearLabelProps {
  year: number;
  selectedYear: number;
  handleYearClick: () => void;
}

function YearLabel({ year, selectedYear, handleYearClick }: YearLabelProps) {
  return (
    <div
      className={`mx-3 cursor-pointer ${year === selectedYear ? 'text-primary' : ''}`}
      onClick={handleYearClick}
    >
      {year}
    </div>
  );
}

export default function Calendar() {
  const routeData = useRouteLoaderData<StatsLoaderData>('routes/running+/route');
  const { activitiesForCalendarByYear } = routeData || { activitiesForCalendarByYear: {} };

  const [year, setYear] = useState(new Date().getFullYear());
  const handleYearClick = useCallback((year: number) => () => setYear(year), []);

  const data = activitiesForCalendarByYear[year] || [];
  const years = Object.keys(activitiesForCalendarByYear);

  return (
    <div className="flex w-full flex-col items-center">
      <div className="my-5 flex flex-row">
        {years.map((y) => {
          const labelYear = parseInt(y, 10);
          return (
            <YearLabel
              key={labelYear}
              year={labelYear}
              selectedYear={year}
              handleYearClick={handleYearClick(labelYear)}
            />
          );
        })}
      </div>
      <div className="flex w-full flex-row">
        <ReactActivityCalendarWrapper data={data} />
      </div>
    </div>
  );
}
