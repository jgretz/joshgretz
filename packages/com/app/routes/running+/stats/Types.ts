import { type Activity as CalendarActivity } from 'react-activity-calendar';
import { type RunningCalendarActivitiesByYear } from './_services/summarizeActivitiesGroupByDayByYear.ts';

export type CalendarLevel = [number, number, string];

export const CalendarLevels = [
  [0, 0, '0 miles'],
  [1, 1, '< 13 miles'],
  [2, 13, 'Half Marathon'],
  [3, 26, 'Marathon'],
  [4, 31, '50K'],
  [5, 49, '50 miles'],
  [6, 61, '100K'],
  [7, 99, '100M'],
] as CalendarLevel[];

export const LevelColors = [
  '#ffffff',
  '#fcc4b3',
  '#fbb099',
  '#fa9c7f',
  '#f98866',
  '#e47c5d',
  '#cf7155',
  '#bb664d',
];

export type RunningCalendarActivity = CalendarActivity & {
  miles: number;
};

export type StatsLoaderData = {
  activitiesForCalendarByYear: RunningCalendarActivitiesByYear;
};
