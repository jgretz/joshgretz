import type {Database} from 'database';
import {drizzle} from 'drizzle-orm/pg-proxy';
import {GetContainer} from 'injectx';

type Captured = {
  sql: () => string;
  params: () => unknown[];
};

// Binds a real drizzle instance whose driver records the statement instead of sending it. The
// query builder is the code under test, so the boundary worth asserting on is the SQL and the
// bound parameters that reach Postgres — not the shape of a hand-rolled builder mock.
export const captureQuery = (): Captured => {
  let sql: string | undefined;
  let params: unknown[] | undefined;

  const database = drizzle(async (query, args) => {
    sql = query;
    params = args;
    return {rows: []};
  });

  GetContainer().Bind(database as unknown as Database, {name: 'database'});

  return {
    sql: () => sql ?? '',
    params: () => params ?? [],
  };
};
