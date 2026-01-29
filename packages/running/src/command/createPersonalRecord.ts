import {Schema} from 'database';
import type {RunningContainer, CreatePersonalRecordInput} from '../Types';
import {InjectIn} from 'injectx';

const command = ({database}: RunningContainer) => {
  return async (input: CreatePersonalRecordInput) => {
    const [record] = await database
      .insert(Schema.personalRecords)
      .values({
        user_id: input.user_id,
        title: input.title,
        time_seconds: input.time_seconds,
        activity_id: input.activity_id ?? null,
      })
      .returning();

    return record;
  };
};

export const createPersonalRecord = InjectIn(command);
