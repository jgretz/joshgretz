import axios from 'axios';
import {User} from '~/Types';
import {API_URLS} from '../../_constants/apiurls';

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
