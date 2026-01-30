import {Schema} from 'database';
import {eq} from 'drizzle-orm';
import type {RunningContainer} from '../Types';
import {InjectIn} from 'injectx';

const command = ({database}: RunningContainer) => {
  return async (id: number) => {
    await database.delete(Schema.futureRaces).where(eq(Schema.futureRaces.id, id));
  };
};

export const deleteFutureRace = InjectIn(command);
