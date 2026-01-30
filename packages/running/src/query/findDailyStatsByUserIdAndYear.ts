import {Schema} from 'database';
import {and, eq, gte, lt} from 'drizzle-orm';
import type {RunningContainer} from '../Types';
import {InjectIn} from 'injectx';

const query = ({database}: RunningContainer) => {
  return async (userId: number, year: number) => {
    const startDate = `${year}-01-01`;
    const endDate = `${year + 1}-01-01`;

    return await database.query.dailyStats.findMany({
      where: and(
        eq(Schema.dailyStats.user_id, userId),
        gte(Schema.dailyStats.date, startDate),
        lt(Schema.dailyStats.date, endDate),
      ),
    });
  };
};

export const findDailyStatsByUserIdAndYear = InjectIn(query);
