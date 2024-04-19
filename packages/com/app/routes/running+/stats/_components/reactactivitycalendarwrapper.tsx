import ReactActivityCalendar from 'react-activity-calendar';
import { useIsClient } from '~/hooks/useIsClient.ts';
import { CalendarLevels, LevelColors, type RunningCalendarActivity } from '../Types.ts';

// this is weird, but its how the library exports the component
const ActivityCalendar = ReactActivityCalendar.default;

const theme = {
  light: LevelColors,
  dark: LevelColors,
};

const maxLevel = CalendarLevels.length - 1;
const labels = {
  months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  totalCount: '{{count}} activities in {{year}}',
  legend: {
    less: 'Less',
    more: 'More',
  },
};

interface Props {
  data: RunningCalendarActivity[];
}

export default function ReactActivityCalendarWrapper({ data }: Props) {
  // react-activity-calendar doesn't support SSR
  const isClient = useIsClient();
  if (!isClient) {
    return <div />;
  }

  return (
    <ActivityCalendar
      data={data}
      theme={theme}
      weekStart={1}
      blockRadius={8}
      labels={labels}
      maxLevel={maxLevel}
      showWeekdayLabels
      hideColorLegend
      hideTotalCount
    />
  );
}
