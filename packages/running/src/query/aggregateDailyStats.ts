import {Schema} from 'database';
import {and, eq, sql, count, inArray} from 'drizzle-orm';
import type {RunningContainer} from '../Types';
import {InjectIn} from 'injectx';

export type DailyAggregation = {
  date: string;
  total_miles: string;
  run_count: number;
};

const query = ({database}: RunningContainer) => {
  return async (userId: number, dates?: string[]): Promise<DailyAggregation[]> => {
    const conditions = [
      eq(Schema.activities.user_id, userId),
      eq(Schema.activities.type, 'Run'),
    ];

    if (dates?.length) {
      conditions.push(
        inArray(sql`DATE(${Schema.activities.start_date_local})`, dates),
      );
    }

    return (await database
      .select({
        date: sql<string>`DATE(${Schema.activities.start_date_local})`.as('date'),
        total_miles:
          sql<string>`COALESCE(SUM(${Schema.activities.distance}::numeric / 1609.344), 0)`.as(
            'total_miles',
          ),
        run_count: count(),
      })
      .from(Schema.activities)
      .where(and(...conditions))
      .groupBy(sql`DATE(${Schema.activities.start_date_local})`)) as DailyAggregation[];
  };
};

export const aggregateDailyStats = InjectIn(query);
