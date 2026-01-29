import {refreshAccessToken} from 'strava';
import {getThirdPartyAccess, setThirdPartyAccess} from '../api-client';

const TOKEN_REFRESH_BUFFER_MS = 5 * 60 * 1000; // 5 minutes

export const getValidAccessToken = async (userId: number): Promise<string> => {
  const access = await getThirdPartyAccess(userId);
  if (!access?.strava_access_token) {
    throw new Error('User does not have Strava access configured');
  }

  // Check if token needs refresh
  const expiresAt = access.strava_token_expires_at;
  if (expiresAt && new Date(expiresAt).getTime() - Date.now() < TOKEN_REFRESH_BUFFER_MS) {
    if (!access.strava_refresh_token) {
      throw new Error('Refresh token not available');
    }

    console.log(`Refreshing token for user ${userId}`);
    const response = await refreshAccessToken(access.strava_refresh_token);

    await setThirdPartyAccess(userId, {
      strava_access_token: response.access_token,
      strava_refresh_token: response.refresh_token,
      strava_token_expires_at: new Date(response.expires_at * 1000).toISOString(),
    });

    return response.access_token;
  }

  return access.strava_access_token;
};
