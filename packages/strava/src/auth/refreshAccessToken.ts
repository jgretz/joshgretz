import axios from 'axios';

export interface RefreshTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

export default async function refreshAccessToken(refreshToken: string): Promise<RefreshTokenResponse> {
  const url = `https://www.strava.com/api/v3/oauth/token`;
  const response = await axios.post<RefreshTokenResponse>(url, {
    client_id: process.env.STRAVA_CLIENT_ID,
    client_secret: process.env.STRAVA_CLIENT_SECRET,
    refresh_token: refreshToken,
    grant_type: 'refresh_token',
  });

  return response.data;
}
