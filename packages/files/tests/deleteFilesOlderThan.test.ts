import {describe, it, expect, beforeEach, mock} from 'bun:test';
import {GetContainer} from 'injectx';
import {deleteFilesOlderThan} from '../src/command/deleteFilesOlderThan';

function makeMockDatabase(returning: {id: number}[]) {
  return {
    delete: mock(() => ({
      where: mock(() => ({
        returning: mock(async () => returning),
      })),
    })),
  };
}

describe('deleteFilesOlderThan', function () {
  beforeEach(function () {
    GetContainer().dependencies.clear();
  });

  it('should return the count of deleted rows', async function () {
    GetContainer().Bind(makeMockDatabase([{id: 1}, {id: 2}, {id: 3}]), {name: 'database'});

    const result = await deleteFilesOlderThan(30);

    expect(result).toEqual({deleted: 3});
  });

  it('should return zero when nothing is old enough', async function () {
    GetContainer().Bind(makeMockDatabase([]), {name: 'database'});

    const result = await deleteFilesOlderThan(30);

    expect(result).toEqual({deleted: 0});
  });
});
