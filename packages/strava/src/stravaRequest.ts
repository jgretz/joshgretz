import axios from 'axios';
import type {StravaConfig} from './Types';

export default function (config: StravaConfig) {
  return async function <T>(path: string): Promise<T> {
    const url = `https://www.strava.com/api/v3${path}`;
    const response = await axios.get<T>(url, {
      headers: {
        Authorization: `Bearer ${config.accessToken}`,
      },
    });

    return response.data;
  };
}
