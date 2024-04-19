import { Outlet, useMatch } from '@remix-run/react';
import { getActivities } from '~/domain/running/services/getActivities.service.ts';
import Menu from './_components/menu.tsx';
import { summarizeActivitiesGroupByDayByYear } from './stats/_services/summarizeActivitiesGroupByDayByYear.ts';
import Stats from './stats/route.tsx';

export async function loader() {
  const activities = await getActivities();

  const activitiesForCalendarByYear = summarizeActivitiesGroupByDayByYear(activities);

  return { activitiesForCalendarByYear };
}

export default function Running() {
  const isRoot = useMatch('/running');
  const Content = isRoot ? <Stats /> : <Outlet />;

  return (
    <div>
      <Menu />
      {Content}
    </div>
  );
}
