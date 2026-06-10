import {Schema} from 'database';
import {eq} from 'drizzle-orm';
import type {FilesContainer} from '../Types';
import {InjectIn} from 'injectx';

const command = ({database}: FilesContainer) => {
  return async (id: number) => {
    const [deleted] = await database
      .delete(Schema.files)
      .where(eq(Schema.files.id, id))
      .returning();

    if (!deleted) {
      throw new Error(`File not found: ${id}`);
    }
  };
};

export const deleteFile = InjectIn(command);
