import {Schema} from 'database';
import type {CreateFileInput, FilesContainer} from '../Types';
import {isUniqueViolation, slugFromFilename, validateUpload} from '../Types';
import {InjectIn} from 'injectx';

const command = ({database}: FilesContainer) => {
  return async (input: CreateFileInput) => {
    const {mime} = validateUpload(input.original_filename, input.data.length);

    const slug = (input.slug?.trim() || slugFromFilename(input.original_filename)).trim();
    if (!slug) {
      throw new Error('Could not derive a slug from the filename');
    }

    try {
      const [file] = await database
        .insert(Schema.files)
        .values({
          slug,
          original_filename: input.original_filename,
          mime_type: mime,
          size_bytes: input.data.length,
          data: input.data,
        })
        .returning();

      if (!file) {
        throw new Error('Failed to create file');
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

export const createFile = InjectIn(command);
