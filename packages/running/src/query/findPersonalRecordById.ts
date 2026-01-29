import {Schema} from 'database';
import {eq} from 'drizzle-orm';
import type {RunningContainer} from '../Types';
import {InjectIn} from 'injectx';

const query = ({database}: RunningContainer) => {
  return async (id: number) => {
    return await database.query.personalRecords.findFirst({
      where: eq(Schema.personalRecords.id, id),
    });
  };
};

export const findPersonalRecordById = InjectIn(query);
