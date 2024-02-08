import axios from 'axios';

interface StravaTokenResponse {
  access_token: string;
  athlete: {
    id: number;
  };
}

export async function getStravaAccessDetails(token: string): Promise<StravaTokenResponse> {
  const url = `https://www.strava.com/api/v3/oauth/token?client_id=${process.env.STRAVA_CLIENT_ID}&client_secret=${process.env.STRAVA_CLIENT_SECRET}&code=${token}&grant_type=authorization_code`;
  const response = await axios.post<StravaTokenResponse>(url);

  return response.data;
}
