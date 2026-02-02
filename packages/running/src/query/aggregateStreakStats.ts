import {Schema} from 'database';
import {and, eq, gte, sql, count} from 'drizzle-orm';
import type {RunningContainer} from '../Types';
import {InjectIn} from 'injectx';

type StreakStats = {
  total_runs: number;
  total_miles: string;
  total_vert: number;
  last_run_date: string | null;
};

const query = ({database}: RunningContainer) => {
  return async (userId: number, startDate: string): Promise<StreakStats> => {
    const [result] = await database
      .select({
        total_runs: count(),
        total_miles: sql<string>`COALESCE(SUM(${Schema.activities.distance}::numeric / 1609.344), 0)`.as(
          'total_miles',
        ),
        total_vert: sql<number>`COALESCE(SUM(${Schema.activities.total_elevation_gain}::numeric * 3.28084), 0)::int`.as(
          'total_vert',
        ),
        last_run_date: sql<string | null>`MAX(COALESCE(${Schema.activities.start_date_local}, ${Schema.activities.start_date}))`.as(
          'last_run_date',
        ),
      })
      .from(Schema.activities)
      .where(
        and(
          eq(Schema.activities.user_id, userId),
          eq(Schema.activities.type, 'Run'),
          gte(Schema.activities.start_date, startDate),
        ),
      );

    return {
      total_runs: result.total_runs,
      total_miles: result.total_miles,
      total_vert: result.total_vert,
      last_run_date: result.last_run_date,
    };
  };
};

export const aggregateStreakStats = InjectIn(query);
