import {Schema} from 'database';
import {eq} from 'drizzle-orm';
import type {ThoughtsContainer} from '../Types';
import {InjectIn} from 'injectx';

const query = ({database}: ThoughtsContainer) => {
  return async (slug: string) => {
    return await database.query.thoughts.findFirst({
      where: eq(Schema.thoughts.slug, slug),
    });
  };
};

export const findThoughtBySlug = InjectIn(query);
