import {Schema} from 'database';
import {desc} from 'drizzle-orm';
import type {ThoughtsContainer} from '../Types';
import {InjectIn} from 'injectx';

const query = ({database}: ThoughtsContainer) => {
  return async () => {
    return await database.query.thoughts.findMany({
      orderBy: desc(Schema.thoughts.created_at),
    });
  };
};

export const findAllThoughts = InjectIn(query);
