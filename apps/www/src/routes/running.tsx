import {createFileRoute} from '@tanstack/react-router';
import {useCallback, useState} from 'react';
import {PageWrapper} from '../components/layout/page-wrapper';
import {HeatmapSection} from '../components/running/heatmap-section';
import {PersonalRecordsSection} from '../components/running/personal-records-section';
import {StravaCTASection} from '../components/running/strava-cta-section';
import {StreakSection} from '../components/running/streak-section';
import {UpcomingRacesSection} from '../components/running/upcoming-races-section';
import {USMapSection} from '../components/running/us-map-section';
import {title} from '../config.shared';
import {getDailyStats} from '../services/daily-stats/daily-stats-server';
import {getFutureRaces} from '../services/future-races/future-races-server';
import {getPersonalRecords} from '../services/personal-records/personal-records-server';
import {getStateStats} from '../services/state-stats/state-stats-server';
import {getStreak} from '../services/streak/streak-server';

const JOSH_USER_ID = 1;
const CURRENT_YEAR = new Date().getFullYear();

export const Route = createFileRoute('/running')({
  head: () => ({
    meta: [{title: title('Running')}, {name: 'description', content: 'Josh Gretz - Running'}],
  }),
  loader: async () => {
    const [streak, stateStats, dailyStats, personalRecords, futureRaces] = await Promise.all([
      getStreak({data: {userId: JOSH_USER_ID}}),
      getStateStats({data: {userId: JOSH_USER_ID}}),
      getDailyStats({data: {userId: JOSH_USER_ID, year: CURRENT_YEAR}}),
      getPersonalRecords({data: {userId: JOSH_USER_ID}}),
      getFutureRaces({data: {userId: JOSH_USER_ID}}),
    ]);
    return {streak, stateStats, dailyStats, personalRecords, futureRaces};
  },
  component: Running,
});

function Running() {
  const {
    streak,
    stateStats,
    dailyStats: initialDailyStats,
    personalRecords,
    futureRaces,
  } = Route.useLoaderData();
  const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR);
  const [dailyStats, setDailyStats] = useState(initialDailyStats);
  const [loading, setLoading] = useState(false);

  const handleYearChange = useCallback(
    async (year: number) => {
      if (year === selectedYear) return;
      setSelectedYear(year);
      setLoading(true);
      try {
        const stats = await getDailyStats({data: {userId: JOSH_USER_ID, year}});
        setDailyStats(stats);
      } finally {
        setLoading(false);
      }
    },
    [selectedYear],
  );

  return (
    <PageWrapper maxWidth="4xl">
      <div className="space-y-16">
        <StreakSection streak={streak} />
        <div className={loading ? 'opacity-50 transition-opacity' : ''}>
          <HeatmapSection
            dailyStats={dailyStats}
            selectedYear={selectedYear}
            onYearChange={handleYearChange}
          />
        </div>
        <USMapSection stateStats={stateStats} />
        <PersonalRecordsSection records={personalRecords} />
        <UpcomingRacesSection races={futureRaces} />
        <StravaCTASection />
      </div>
    </PageWrapper>
  );
}
