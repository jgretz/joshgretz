import {Schema} from 'database';
import {and, eq, isNotNull, sql, count} from 'drizzle-orm';
import type {RunningContainer} from '../Types';
import {InjectIn} from 'injectx';

export type StateAggregation = {
  location_state: string;
  run_count: number;
  marathon_count: number;
};

const query = ({database}: RunningContainer) => {
  return async (userId: number): Promise<StateAggregation[]> => {
    return await database
      .select({
        location_state: Schema.activities.location_state,
        run_count: count(),
        marathon_count:
          sql<number>`COUNT(*) FILTER (WHERE ${Schema.activities.distance}::numeric >= 42195)`.as(
            'marathon_count',
          ),
      })
      .from(Schema.activities)
      .where(
        and(
          eq(Schema.activities.user_id, userId),
          eq(Schema.activities.type, 'Run'),
          isNotNull(Schema.activities.location_state),
        ),
      )
      .groupBy(Schema.activities.location_state) as StateAggregation[];
  };
};

export const aggregateStatsByState = InjectIn(query);
