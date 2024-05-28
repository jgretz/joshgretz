import axios from 'axios';
import {GetContainer} from 'injectx';

export default async function <T>(path: string): Promise<T> {
  const url = `https://www.strava.com/api/v3${path}`;

  // doing this rather than InjectIn to because the InjectIn call loses the generic typing of the function
  const accessToken = GetContainer().resolve('accessToken');

  const response = await axios.get<T>(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.data;
}
