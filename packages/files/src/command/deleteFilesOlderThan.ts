import {Schema} from 'database';
import {lt} from 'drizzle-orm';
import type {FilesContainer} from '../Types';
import {InjectIn} from 'injectx';

// Deletes files whose created_at is older than `days` days. Returns the count removed.
const command = ({database}: FilesContainer) => {
  return async (days: number) => {
    const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
    const deleted = await database
      .delete(Schema.files)
      .where(lt(Schema.files.created_at, cutoff))
      .returning({id: Schema.files.id});
    return {deleted: deleted.length};
  };
};

export const deleteFilesOlderThan = InjectIn(command);
