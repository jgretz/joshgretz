import {describe, it, expect, beforeEach, mock} from 'bun:test';
import {GetContainer} from 'injectx';
import type {Thought} from '../src/Types';
import {deleteThought} from '../src/command/deleteThought';

function makeMockDatabase(returning: Partial<Thought>[]) {
  return {
    delete: mock(() => ({
      where: mock(() => ({
        returning: mock(async () => returning),
      })),
    })),
  };
}

describe('deleteThought', function () {
  beforeEach(function () {
    GetContainer().dependencies.clear();
  });

  it('should not throw when thought exists', async function () {
    const db = makeMockDatabase([{id: 1}]);
    GetContainer().Bind(db, {name: 'database'});

    await expect(deleteThought(1)).resolves.toBeUndefined();
  });

  it('should throw when thought not found', async function () {
    const db = makeMockDatabase([]);
    GetContainer().Bind(db, {name: 'database'});

    await expect(deleteThought(999)).rejects.toThrow('Thought not found: 999');
  });
});
