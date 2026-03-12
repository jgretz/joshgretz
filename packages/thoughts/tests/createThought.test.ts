import {describe, it, expect, beforeEach, mock} from 'bun:test';
import {GetContainer} from 'injectx';
import type {Thought, CreateThoughtInput} from '../src/Types';
import {createThought} from '../src/command/createThought';

function makeMockDatabase(returning: Thought[]) {
  return {
    insert: mock(() => ({
      values: mock(() => ({
        returning: mock(async () => returning),
      })),
    })),
  };
}

const baseInput: CreateThoughtInput = {
  title: 'Test Thought',
  slug: 'test-thought',
  content: 'Some content',
};

const fakeThought: Thought = {
  id: 1,
  title: 'Test Thought',
  slug: 'test-thought',
  content: 'Some content',
  tags: null,
  published_at: null,
  created_at: '2026-01-01T00:00:00.000Z',
  updated_at: '2026-01-01T00:00:00.000Z',
};

describe('createThought', function () {
  beforeEach(function () {
    GetContainer().dependencies.clear();
  });

  it('should return the created thought', async function () {
    const db = makeMockDatabase([fakeThought]);
    GetContainer().Bind(db, {name: 'database'});

    const result = await createThought(baseInput);

    expect(result).toEqual(fakeThought);
  });

  it('should throw when returning() yields no row', async function () {
    const db = makeMockDatabase([]);
    GetContainer().Bind(db, {name: 'database'});

    await expect(createThought(baseInput)).rejects.toThrow('Failed to create thought');
  });

  it('should pass optional fields as null when omitted', async function () {
    const db = makeMockDatabase([fakeThought]);
    GetContainer().Bind(db, {name: 'database'});

    await createThought(baseInput);

    const valuesCall = db.insert.mock.results[0]!.value.values;
    const passedValues = valuesCall.mock.calls[0]![0];
    expect(passedValues.tags).toBeNull();
    expect(passedValues.published_at).toBeNull();
  });
});
