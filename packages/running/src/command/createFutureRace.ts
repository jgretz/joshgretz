import {Schema} from 'database';
import type {RunningContainer, CreateFutureRaceInput} from '../Types';
import {InjectIn} from 'injectx';

const command = ({database}: RunningContainer) => {
  return async (input: CreateFutureRaceInput) => {
    const [record] = await database
      .insert(Schema.futureRaces)
      .values({
        user_id: input.user_id,
        title: input.title,
        location: input.location ?? null,
        distance: input.distance ?? null,
        url: input.url ?? null,
        race_date: input.race_date ?? null,
      })
      .returning();

    return record;
  };
};

export const createFutureRace = InjectIn(command);
