import { compareAsc, format, getYear } from 'date-fns';
import { type Activity } from '~/domain/running/Types.ts';
import { CalendarLevels, type RunningCalendarActivity } from '../Types.ts';

export type RunningCalendarActivitiesByYear = { [key: string]: RunningCalendarActivity[] };

function metersToMiles(meters: number) {
  return meters * 0.000621371;
}

function milesToIntensity(miles: number) {
  const level = CalendarLevels.find(
    (level, index) =>
      miles >= level[1] &&
      (miles < CalendarLevels[index + 1][1] || CalendarLevels.length <= index + 1),
  );

  return level ? level[0] : 0;
}

function generateFullYear(year: number) {
  const end = new Date(year, 11, 31);
  const activities = [];

  for (let date = new Date(year, 0, 1); date <= end; date.setDate(date.getDate() + 1)) {
    const dateStr = format(date, 'yyyy-MM-dd');
    activities.push({ date: dateStr, count: 0, level: 0, miles: 0 });
  }

  return activities;
}

export function summarizeActivitiesGroupByDayByYear(activities: Activity[]) {
  activities.sort((a, b) => compareAsc(a.start_date_local, b.start_date_local));

  return activities.reduce((acc, activity) => {
    const date = format(activity.start_date_local, 'yyyy-MM-dd');
    const year = getYear(activity.start_date_local).toString();

    const arr = acc[year] || generateFullYear(parseInt(year, 10));
    acc[year] = arr;

    let ra = arr.find((item) => item.date === date);
    if (!ra) {
      ra = { date, count: 0, level: 0, miles: 0 };
      arr.push(ra);
    }

    ra.count++;
    ra.miles += metersToMiles(activity.distance);
    ra.level = milesToIntensity(ra.miles);

    return acc;
  }, {} as RunningCalendarActivitiesByYear);
}
