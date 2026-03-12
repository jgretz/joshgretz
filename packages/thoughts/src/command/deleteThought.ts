import {Schema} from 'database';
import {eq} from 'drizzle-orm';
import type {ThoughtsContainer} from '../Types';
import {InjectIn} from 'injectx';

const command = ({database}: ThoughtsContainer) => {
  return async (id: number) => {
    const [deleted] = await database
      .delete(Schema.thoughts)
      .where(eq(Schema.thoughts.id, id))
      .returning();

    if (!deleted) {
      throw new Error(`Thought not found: ${id}`);
    }
  };
};

export const deleteThought = InjectIn(command);
