import {Schema} from 'database';
import {eq} from 'drizzle-orm';
import type {RunningContainer, UpdateFutureRaceInput} from '../Types';
import {InjectIn} from 'injectx';

const command = ({database}: RunningContainer) => {
  return async (id: number, input: UpdateFutureRaceInput) => {
    const [record] = await database
      .update(Schema.futureRaces)
      .set({
        ...input,
        updated_at: new Date(),
      })
      .where(eq(Schema.futureRaces.id, id))
      .returning();

    return record;
  };
};

export const updateFutureRace = InjectIn(command);
