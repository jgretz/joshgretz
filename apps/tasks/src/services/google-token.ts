import {refreshAccessToken} from 'google-sheets';
import {getThirdPartyAccess, setThirdPartyAccess} from '../api-client';

const TOKEN_REFRESH_BUFFER_MS = 5 * 60 * 1000; // 5 minutes

export const getValidGoogleAccessToken = async (
  userId: number,
): Promise<{accessToken: string; spreadsheetId: string}> => {
  const access = await getThirdPartyAccess(userId);
  if (!access?.google_access_token) {
    throw new Error('User does not have Google Sheets access configured');
  }

  if (!access.google_spreadsheet_id) {
    throw new Error('User does not have a spreadsheet ID configured');
  }

  // Check if token needs refresh
  const expiresAt = access.google_token_expires_at;
  if (expiresAt && new Date(expiresAt).getTime() - Date.now() < TOKEN_REFRESH_BUFFER_MS) {
    if (!access.google_refresh_token) {
      throw new Error('Google refresh token not available');
    }

    console.log(`Refreshing Google token for user ${userId}`);
    const response = await refreshAccessToken(access.google_refresh_token);

    const newExpiresAt = new Date(Date.now() + response.expires_in * 1000).toISOString();

    await setThirdPartyAccess(userId, {
      google_access_token: response.access_token,
      google_token_expires_at: newExpiresAt,
    });

    return {
      accessToken: response.access_token,
      spreadsheetId: access.google_spreadsheet_id,
    };
  }

  return {
    accessToken: access.google_access_token,
    spreadsheetId: access.google_spreadsheet_id,
  };
};
