import {Schema} from 'database';
import {and, desc, isNotNull, lte} from 'drizzle-orm';
import type {ThoughtsContainer} from '../Types';
import {InjectIn} from 'injectx';

const query = ({database}: ThoughtsContainer) => {
  return async () => {
    return await database.query.thoughts.findMany({
      where: and(
        isNotNull(Schema.thoughts.published_at),
        lte(Schema.thoughts.published_at, new Date().toISOString()),
      ),
      orderBy: desc(Schema.thoughts.published_at),
    });
  };
};

export const findPublishedThoughts = InjectIn(query);
