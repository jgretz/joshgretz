import {Schema} from 'database';
import {eq} from 'drizzle-orm';
import type {RunningContainer} from '../Types';
import {InjectIn} from 'injectx';

const query = ({database}: RunningContainer) => {
  return async (userId: number) => {
    return await database.query.stateStats.findMany({
      where: eq(Schema.stateStats.user_id, userId),
    });
  };
};

export const findStateStatsByUserId = InjectIn(query);
