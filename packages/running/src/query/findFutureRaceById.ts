import {Schema} from 'database';
import {eq} from 'drizzle-orm';
import type {RunningContainer} from '../Types';
import {InjectIn} from 'injectx';

const query = ({database}: RunningContainer) => {
  return async (id: number) => {
    return await database.query.futureRaces.findFirst({
      where: eq(Schema.futureRaces.id, id),
    });
  };
};

export const findFutureRaceById = InjectIn(query);
