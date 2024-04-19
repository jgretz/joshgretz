// http://api.openweathermap.org/geo/1.0/reverse?lat={lat}&lon={lon}&limit={limit}&appid={API key}
import {and, eq} from 'drizzle-orm';
import {DrizzleService} from '../../../db/services/db.service';
import {stravaActivities} from 'src/db/schema';
import axios from 'axios';
import {WeatherLocation} from '../../WeatherApiTypes';

export async function lookupLocationByLatLng(drizzle: DrizzleService, lat: number, lon: number) {
  if (!lat || !lon) {
    return null;
  }

  // lets see if we have it in the db
  const activity = await drizzle.db.query.stravaActivities.findFirst({
    columns: {location_city: true, location_state: true, location_country: true},
    where: and(
      eq(stravaActivities.start_lat, lat.toString()),
      eq(stravaActivities.start_lng, lon.toString()),
    ),
  });

  if (activity) {
    return activity;
  }

  console.log(`Looking up location at: {${lat}, ${lon}}`);

  const url = `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${process.env.OPEN_WEATHER_API_KEY}`;
  const response = await axios.get<WeatherLocation[]>(url);

  if (response.data.length === 0) {
    return null;
  }

  const location = response.data[0];
  return {
    location_city: location.name,
    location_state: location.state,
    location_country: location.country,
  };
}
