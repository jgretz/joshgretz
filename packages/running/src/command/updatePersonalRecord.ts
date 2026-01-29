import {Schema} from 'database';
import {eq} from 'drizzle-orm';
import type {RunningContainer, UpdatePersonalRecordInput} from '../Types';
import {InjectIn} from 'injectx';

const command = ({database}: RunningContainer) => {
  return async (id: number, input: UpdatePersonalRecordInput) => {
    const [record] = await database
      .update(Schema.personalRecords)
      .set({
        ...input,
        updated_at: new Date(),
      })
      .where(eq(Schema.personalRecords.id, id))
      .returning();

    return record;
  };
};

export const updatePersonalRecord = InjectIn(command);
