import {Schema} from 'database';
import {eq} from 'drizzle-orm';
import type {FilesContainer, UpdateFileSlugInput} from '../Types';
import {isUniqueViolation} from '../Types';
import {InjectIn} from 'injectx';

const command = ({database}: FilesContainer) => {
  return async (id: number, input: UpdateFileSlugInput) => {
    const slug = input.slug.trim();
    if (!slug) {
      throw new Error('Slug cannot be empty');
    }

    try {
      const [file] = await database
        .update(Schema.files)
        .set({slug, updated_at: new Date().toISOString()})
        .where(eq(Schema.files.id, id))
        .returning();

      if (!file) {
        throw new Error(`File not found: ${id}`);
      }

      return file;
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new Error(`Slug already in use: ${slug}`);
      }
      throw error;
    }
  };
};

export const updateFileSlug = InjectIn(command);
