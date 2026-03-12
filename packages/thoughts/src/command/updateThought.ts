import {Schema} from 'database';
import {eq} from 'drizzle-orm';
import type {ThoughtsContainer, UpdateThoughtInput} from '../Types';
import {InjectIn} from 'injectx';

const command = ({database}: ThoughtsContainer) => {
  return async (id: number, input: UpdateThoughtInput) => {
    const [thought] = await database
      .update(Schema.thoughts)
      .set({...input, updated_at: new Date().toISOString()})
      .where(eq(Schema.thoughts.id, id))
      .returning();

    if (!thought) {
      throw new Error(`Thought not found: ${id}`);
    }

    return thought;
  };
};

export const updateThought = InjectIn(command);
