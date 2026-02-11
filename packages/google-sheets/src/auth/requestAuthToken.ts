import type {GoogleTokenResponse} from '../Types';

const requestAuthToken = async (
  code: string,
  redirectUri: string,
): Promise<GoogleTokenResponse> => {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID || '',
      client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to exchange Google auth code: ${error}`);
  }

  return response.json();
};

export default requestAuthToken;
