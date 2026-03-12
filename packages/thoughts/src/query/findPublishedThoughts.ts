import {Schema} from 'database';
import {desc, isNotNull} from 'drizzle-orm';
import type {ThoughtsContainer} from '../Types';
import {InjectIn} from 'injectx';

const query = ({database}: ThoughtsContainer) => {
  return async () => {
    return await database.query.thoughts.findMany({
      where: isNotNull(Schema.thoughts.published_at),
      orderBy: desc(Schema.thoughts.published_at),
    });
  };
};

export const findPublishedThoughts = InjectIn(query);
