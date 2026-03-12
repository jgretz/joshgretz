import {Schema} from 'database';
import {eq} from 'drizzle-orm';
import type {ThoughtsContainer} from '../Types';
import {InjectIn} from 'injectx';

const query = ({database}: ThoughtsContainer) => {
  return async (id: number) => {
    return await database.query.thoughts.findFirst({
      where: eq(Schema.thoughts.id, id),
    });
  };
};

export const findThoughtById = InjectIn(query);
