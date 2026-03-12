import {Schema} from 'database';
import {eq} from 'drizzle-orm';
import type {ThoughtsContainer} from '../Types';
import {InjectIn} from 'injectx';

const command = ({database}: ThoughtsContainer) => {
  return async (id: number) => {
    await database.delete(Schema.thoughts).where(eq(Schema.thoughts.id, id));
  };
};

export const deleteThought = InjectIn(command);
