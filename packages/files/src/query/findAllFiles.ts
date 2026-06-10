import {Schema} from 'database';
import {desc} from 'drizzle-orm';
import type {FilesContainer} from '../Types';
import {InjectIn} from 'injectx';

// Metadata only — never selects the `data` column so the admin list stays light.
const query = ({database}: FilesContainer) => {
  return async () => {
    return await database
      .select({
        id: Schema.files.id,
        slug: Schema.files.slug,
        original_filename: Schema.files.original_filename,
        mime_type: Schema.files.mime_type,
        size_bytes: Schema.files.size_bytes,
        created_at: Schema.files.created_at,
        updated_at: Schema.files.updated_at,
      })
      .from(Schema.files)
      .orderBy(desc(Schema.files.created_at));
  };
};

export const findAllFiles = InjectIn(query);
