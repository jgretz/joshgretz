import axios from 'axios';
import { type User } from '~/domain/security/Types.ts';
import { API_URLS } from '../../_constants/apiurls.ts';

export async function updateStravaAccessDetails(
  user: User,
  code: string,
  access_token: string,
  athlete_id: number,
) {
  const response = await axios.post(API_URLS.UpdateStravaAccessDetails, {
    user_id: user.id,
    strava_id: athlete_id,
    strava_access_token: access_token,
    strava_code: code,
  });

  return response.data;
}
