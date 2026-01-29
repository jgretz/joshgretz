import {Schema} from 'database';
import {eq} from 'drizzle-orm';
import type {JobsContainer} from '../Types';
import {InjectIn} from 'injectx';

const command = ({database}: JobsContainer) => {
  return async (id: number) => {
    await database
      .update(Schema.jobs)
      .set({
        status: 'pending',
        error_message: null,
        started_at: null,
        completed_at: null,
      })
      .where(eq(Schema.jobs.id, id));
  };
};

export const retryJob = InjectIn(command);
