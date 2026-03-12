import {describe, it, expect, beforeEach, mock} from 'bun:test';
import {GetContainer} from 'injectx';
import type {Thought} from '../src/Types';
import {findPublishedThoughts} from '../src/query/findPublishedThoughts';

const pastThought: Thought = {
  id: 1,
  title: 'Past',
  slug: 'past',
  content: 'Published in the past',
  tags: null,
  published_at: '2025-01-01T00:00:00.000Z',
  created_at: '2025-01-01T00:00:00.000Z',
  updated_at: '2025-01-01T00:00:00.000Z',
};

function makeMockDatabase(results: Thought[]) {
  return {
    query: {
      thoughts: {
        findMany: mock(async () => results),
      },
    },
  };
}

describe('findPublishedThoughts', function () {
  beforeEach(function () {
    GetContainer().dependencies.clear();
  });

  it('should return published thoughts', async function () {
    const db = makeMockDatabase([pastThought]);
    GetContainer().Bind(db, {name: 'database'});

    const result = await findPublishedThoughts();

    expect(result).toEqual([pastThought]);
  });

  it('should pass where and orderBy options to findMany', async function () {
    const db = makeMockDatabase([]);
    GetContainer().Bind(db, {name: 'database'});

    await findPublishedThoughts();

    const call = db.query.thoughts.findMany.mock.calls[0]![0];
    expect(call).toHaveProperty('where');
    expect(call).toHaveProperty('orderBy');
  });

  it('should return empty array when no published thoughts exist', async function () {
    const db = makeMockDatabase([]);
    GetContainer().Bind(db, {name: 'database'});

    const result = await findPublishedThoughts();

    expect(result).toEqual([]);
  });
});
