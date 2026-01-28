import Geoapify from 'geoapify';
import type {Activity} from 'strava';
import {findFirstActivityByLatLon} from '../query/findFirstActivityByLatLon';

export async function lookupLocationForActivity(activity: Activity) {
  if (!activity.start_latlng || activity.start_latlng.length < 2) {
    return undefined;
  }

  // lets see if we have another activity with the same start location
  console.log(
    `Looking up location for activity ${activity.start_latlng[0]}, ${activity.start_latlng[1]}`,
  );
  const existing = await findFirstActivityByLatLon(
    activity.start_latlng[0].toString(),
    activity.start_latlng[1].toString(),
  );
  if (existing) {
    return {
      city: existing.location_city,
      state: existing.location_state,
      country: existing.location_country,
    };
  }

  console.log(`Calling geoapify for ${activity.start_latlng[0]}, ${activity.start_latlng[1]}`);

  // call out to geoapify to get the location
  const location = await Geoapify.queries.reverseGeocode(
    activity.start_latlng[0],
    activity.start_latlng[1],
  );

  if (!location) {
    return undefined;
  }

  return {
    city: location.name,
    state: location.state,
    country: location.country,
  };
}
