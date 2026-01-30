import {Schema} from 'database';
import {asc, eq} from 'drizzle-orm';
import type {RunningContainer} from '../Types';
import {InjectIn} from 'injectx';

const query = ({database}: RunningContainer) => {
  return async (userId: number) => {
    return await database.query.futureRaces.findMany({
      where: eq(Schema.futureRaces.user_id, userId),
      orderBy: asc(Schema.futureRaces.race_date),
    });
  };
};

export const findFutureRacesByUserId = InjectIn(query);
