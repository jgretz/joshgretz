import {Schema} from 'database';
import {and, eq} from 'drizzle-orm';
import type {RunningContainer} from '../Types';
import {InjectIn} from 'injectx';

function query({database}: RunningContainer) {
  return async function (lat: string, lon: string) {
    return await database.query.activities.findFirst({
      columns: {location_city: true, location_state: true, location_country: true},
      where: and(eq(Schema.activities.start_lat, lat), eq(Schema.activities.start_lng, lon)),
    });
  };
}

export const findFirstActivityByLatLon = InjectIn(query);
