import axios from 'axios';
import { API_URLS } from '../../_constants/apiurls.ts';

export async function importStravaActivities(userId: number) {
  const response = await axios.post(API_URLS.ImportStravaActivities, {
    user_id: userId,
  });

  return response.data;
}
