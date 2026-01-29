import axios from 'axios';

export interface StravaTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  athlete: {
    id: number;
  };
}

export default async function requestAuthToken(code: string): Promise<StravaTokenResponse> {
  const url = `https://www.strava.com/api/v3/oauth/token?client_id=${process.env.STRAVA_CLIENT_ID}&client_secret=${process.env.STRAVA_CLIENT_SECRET}&code=${code}&grant_type=authorization_code`;
  const response = await axios.post<StravaTokenResponse>(url);

  return response.data;
}
