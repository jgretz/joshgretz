import {Schema} from 'database';
import type {ThoughtsContainer, CreateThoughtInput} from '../Types';
import {InjectIn} from 'injectx';

const command = ({database}: ThoughtsContainer) => {
  return async (input: CreateThoughtInput) => {
    const [thought] = await database
      .insert(Schema.thoughts)
      .values({
        title: input.title,
        slug: input.slug,
        content: input.content,
        tags: input.tags ?? null,
        published_at: input.published_at ?? null,
      })
      .returning();

    if (!thought) {
      throw new Error('Failed to create thought');
    }

    return thought;
  };
};

export const createThought = InjectIn(command);
