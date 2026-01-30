import {Schema} from 'database';
import {asc, eq, sql} from 'drizzle-orm';
import type {RunningContainer} from '../Types';
import {InjectIn} from 'injectx';

const query = ({database}: RunningContainer) => {
  return async (userId: number) => {
    return await database.query.personalRecords.findMany({
      where: eq(Schema.personalRecords.user_id, userId),
      orderBy: asc(sql`cast(${Schema.personalRecords.distance} as numeric)`),
    });
  };
};

export const findPersonalRecordsByUserId = InjectIn(query);
