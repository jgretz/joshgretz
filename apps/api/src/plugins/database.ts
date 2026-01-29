import Elysia from 'elysia';
import {createDatabase} from 'database';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error('DATABASE_URL not set');

export const databasePlugin = new Elysia({name: 'database'}).decorate(
  'database',
  createDatabase(databaseUrl),
);
