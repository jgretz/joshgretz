import {describe, it, expect, beforeEach, mock} from 'bun:test';
import {GetContainer} from 'injectx';
import type {FileRecord} from '../src/Types';
import {MAX_FILE_SIZE_BYTES} from '../src/Types';
import {createFile} from '../src/command/createFile';

function makeMockDatabase(returning: FileRecord[]) {
  return {
    insert: mock(() => ({
      values: mock(() => ({
        returning: mock(async () => returning),
      })),
    })),
  };
}

const fakeFile: FileRecord = {
  id: 1,
  slug: 'my-screenshot',
  original_filename: 'My Screenshot.png',
  mime_type: 'image/png',
  size_bytes: 3,
  data: Buffer.from('abc'),
  created_at: '2026-01-01T00:00:00.000Z',
  updated_at: '2026-01-01T00:00:00.000Z',
};

describe('createFile', function () {
  beforeEach(function () {
    GetContainer().dependencies.clear();
  });

  it('should reject an unsupported file type', async function () {
    GetContainer().Bind(makeMockDatabase([fakeFile]), {name: 'database'});

    await expect(
      createFile({original_filename: 'notes.txt', data: Buffer.from('hello')}),
    ).rejects.toThrow('Unsupported file type');
  });

  it('should reject a file over the size limit', async function () {
    GetContainer().Bind(makeMockDatabase([fakeFile]), {name: 'database'});

    await expect(
      createFile({
        original_filename: 'big.png',
        data: Buffer.alloc(MAX_FILE_SIZE_BYTES + 1),
      }),
    ).rejects.toThrow('File too large');
  });

  it('should reject an empty file', async function () {
    GetContainer().Bind(makeMockDatabase([fakeFile]), {name: 'database'});

    await expect(
      createFile({original_filename: 'empty.png', data: Buffer.alloc(0)}),
    ).rejects.toThrow('File is empty');
  });

  it('should derive the slug from the filename when none is provided', async function () {
    const db = makeMockDatabase([fakeFile]);
    GetContainer().Bind(db, {name: 'database'});

    await createFile({original_filename: 'My Screenshot.png', data: Buffer.from('abc')});

    const valuesCall = db.insert.mock.results[0]!.value.values;
    const passedValues = valuesCall.mock.calls[0]![0] as {
      slug: string;
      mime_type: string;
      size_bytes: number;
    };
    expect(passedValues.slug).toBe('my-screenshot');
    expect(passedValues.mime_type).toBe('image/png');
    expect(passedValues.size_bytes).toBe(3);
  });

  it('should use a provided slug over the filename', async function () {
    const db = makeMockDatabase([fakeFile]);
    GetContainer().Bind(db, {name: 'database'});

    await createFile({
      original_filename: 'My Screenshot.png',
      slug: 'custom-slug',
      data: Buffer.from('abc'),
    });

    const valuesCall = db.insert.mock.results[0]!.value.values;
    const passedValues = valuesCall.mock.calls[0]![0] as {slug: string};
    expect(passedValues.slug).toBe('custom-slug');
  });

  it('should map a unique-violation to a slug-in-use error', async function () {
    const db = {
      insert: mock(() => ({
        values: mock(() => ({
          returning: mock(async () => {
            throw {code: '23505'};
          }),
        })),
      })),
    };
    GetContainer().Bind(db, {name: 'database'});

    await expect(
      createFile({original_filename: 'dupe.png', data: Buffer.from('abc')}),
    ).rejects.toThrow('Slug already in use');
  });
});
