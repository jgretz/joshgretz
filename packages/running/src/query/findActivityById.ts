import {Schema} from 'database';
import {eq} from 'drizzle-orm';
import type {RunningContainer} from '../Types';
import {InjectIn} from 'injectx';

function query({database}: RunningContainer) {
  return async function (id: number) {
    const activity = await database.query.activities.findFirst({
      where: eq(Schema.activities.id, id),
    });

    return activity;
  };
}

export const findActivityById = InjectIn(query);
