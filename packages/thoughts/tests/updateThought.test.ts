import {describe, it, expect, beforeEach, mock} from 'bun:test';
import {GetContainer} from 'injectx';
import type {Thought} from '../src/Types';
import {updateThought} from '../src/command/updateThought';

function makeMockDatabase(returning: Thought[]) {
  return {
    update: mock(() => ({
      set: mock(() => ({
        where: mock(() => ({
          returning: mock(async () => returning),
        })),
      })),
    })),
  };
}

const fakeThought: Thought = {
  id: 1,
  title: 'Updated',
  slug: 'updated',
  content: 'Updated content',
  description: null,
  tags: null,
  published_at: null,
  created_at: '2026-01-01T00:00:00.000Z',
  updated_at: '2026-01-01T00:00:00.000Z',
};

describe('updateThought', function () {
  beforeEach(function () {
    GetContainer().dependencies.clear();
  });

  it('should return the updated thought', async function () {
    const db = makeMockDatabase([fakeThought]);
    GetContainer().Bind(db, {name: 'database'});

    const result = await updateThought(1, {title: 'Updated'});

    expect(result).toEqual(fakeThought);
  });

  it('should throw when thought not found', async function () {
    const db = makeMockDatabase([]);
    GetContainer().Bind(db, {name: 'database'});

    await expect(updateThought(999, {title: 'Nope'})).rejects.toThrow('Thought not found: 999');
  });
});
