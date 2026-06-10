import {describe, it, expect, beforeEach, mock} from 'bun:test';
import {GetContainer} from 'injectx';
import type {FileRecord} from '../src/Types';
import {deleteFile} from '../src/command/deleteFile';

function makeMockDatabase(returning: FileRecord[]) {
  return {
    delete: mock(() => ({
      where: mock(() => ({
        returning: mock(async () => returning),
      })),
    })),
  };
}

const fakeFile: FileRecord = {
  id: 7,
  slug: 'doc',
  original_filename: 'doc.md',
  mime_type: 'text/markdown',
  size_bytes: 5,
  data: Buffer.from('hello'),
  created_at: null,
  updated_at: null,
};

describe('deleteFile', function () {
  beforeEach(function () {
    GetContainer().dependencies.clear();
  });

  it('should resolve when a row is deleted', async function () {
    GetContainer().Bind(makeMockDatabase([fakeFile]), {name: 'database'});

    await expect(deleteFile(7)).resolves.toBeUndefined();
  });

  it('should throw when no row matches the id', async function () {
    GetContainer().Bind(makeMockDatabase([]), {name: 'database'});

    await expect(deleteFile(999)).rejects.toThrow('File not found: 999');
  });
});
