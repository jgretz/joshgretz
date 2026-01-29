import {Schema} from 'database';
import {eq} from 'drizzle-orm';
import type {RunningContainer} from '../Types';
import {InjectIn} from 'injectx';

const query = ({database}: RunningContainer) => {
  return async (userId: number) => {
    return await database.query.personalRecords.findMany({
      where: eq(Schema.personalRecords.user_id, userId),
    });
  };
};

export const findPersonalRecordsByUserId = InjectIn(query);
