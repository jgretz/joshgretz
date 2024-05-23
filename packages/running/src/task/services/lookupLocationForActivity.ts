import {type Database, Schema} from 'database';
import type {Geo} from 'packages/geoapify/src';
import type {Activity} from 'strava';
import {and, eq} from 'drizzle-orm';

export default async function lookupLocationForActivity(
  database: Database,
  geo: Geo,
  activity: Activity,
) {
  if (!activity.start_latlng) {
    return undefined;
  }

  // lets see if we have another activity with the same start location
  console.log(
    `Looking up location for activity ${activity.start_latlng[0]}, ${activity.start_latlng[1]}`,
  );
  const existing = await database.query.activities.findFirst({
    columns: {location_city: true, location_state: true, location_country: true},
    where: and(
      eq(Schema.activities.start_lat, activity.start_latlng[0].toString()),
      eq(Schema.activities.start_lng, activity.start_latlng[1].toString()),
    ),
  });

  if (existing) {
    return {
      city: existing.location_city,
      state: existing.location_state,
      country: existing.location_country,
    };
  }

  console.log(`Calling geoapify for ${activity.start_latlng[0]}, ${activity.start_latlng[1]}`);

  // call out to geoapify to get the location
  const location = await geo.reverseGeoLookup(activity.start_latlng[0], activity.start_latlng[1]);

  if (!location) {
    return undefined;
  }

  return {
    city: location.name,
    state: location.state,
    country: location.country,
  };
}
