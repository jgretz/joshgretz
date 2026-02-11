import {Schema} from 'database';
import {and, eq, gte, lte} from 'drizzle-orm';
import type {RunningContainer} from '../Types';
import {InjectIn} from 'injectx';

type Input = {
  userId: number;
  from?: string;
  to?: string;
};

const query = ({database}: RunningContainer) => {
  return async ({userId, from, to}: Input) => {
    const conditions = [eq(Schema.activities.user_id, userId)];

    if (from) {
      conditions.push(gte(Schema.activities.start_date_local, from));
    }

    if (to) {
      conditions.push(lte(Schema.activities.start_date_local, to));
    }

    return await database
      .select()
      .from(Schema.activities)
      .where(and(...conditions));
  };
};

export const findActivitiesByDateRange = InjectIn(query);
