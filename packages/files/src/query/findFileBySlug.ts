import {Schema} from 'database';
import {eq} from 'drizzle-orm';
import type {FilesContainer} from '../Types';
import {InjectIn} from 'injectx';

// Full record including `data` bytes — used for raw serving and markdown content.
const query = ({database}: FilesContainer) => {
  return async (slug: string) => {
    return await database.query.files.findFirst({
      where: eq(Schema.files.slug, slug),
    });
  };
};

export const findFileBySlug = InjectIn(query);
