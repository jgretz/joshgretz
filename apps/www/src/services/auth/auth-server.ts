import {createServerFn} from '@tanstack/react-start';
import type {User} from './types';

interface GoogleTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
  id_token?: string;
}

interface GoogleUserInfo {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  picture: string;
}

const getEnv = () => ({
  googleClientId: process.env.GOOGLE_CLIENT_ID || '',
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  apiUrl: process.env.JOSHGRETZ_API_URL || 'http://localhost:3001',
  apiToken: process.env.JOSHGRETZ_API_TOKEN || '',
});

export const exchangeCodeForUser = createServerFn({
  method: 'POST',
})
  .inputValidator((data: {code: string; redirectUri: string}) => data)
  .handler(async ({data}) => {
    const env = getEnv();

    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: new URLSearchParams({
        code: data.code,
        client_id: env.googleClientId,
        client_secret: env.googleClientSecret,
        redirect_uri: data.redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.text();
      throw new Error(`Failed to exchange code: ${error}`);
    }

    const tokens: GoogleTokenResponse = await tokenResponse.json();

    // Get user info from Google
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {Authorization: `Bearer ${tokens.access_token}`},
    });

    if (!userInfoResponse.ok) {
      throw new Error('Failed to get user info from Google');
    }

    const googleUser: GoogleUserInfo = await userInfoResponse.json();

    // Look up user in our database via API
    const apiResponse = await fetch(
      `${env.apiUrl}/users/query?email=${encodeURIComponent(googleUser.email)}`,
      {
        headers: {Authorization: `Bearer ${env.apiToken}`},
      },
    );

    if (!apiResponse.ok) {
      throw new Error('Failed to verify user');
    }

    const user: User | null = await apiResponse.json();

    if (!user) {
      throw new Error(`Email ${googleUser.email} is not registered`);
    }

    if (!user.admin) {
      throw new Error(`Email ${googleUser.email} is not an admin`);
    }

    return user;
  });

export const getThirdPartyAccess = createServerFn({
  method: 'GET',
})
  .inputValidator((data: {userId: number}) => data)
  .handler(async ({data}) => {
    const env = getEnv();

    const response = await fetch(`${env.apiUrl}/users/third-party-access?user_id=${data.userId}`, {
      headers: {Authorization: `Bearer ${env.apiToken}`},
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  });

export const setThirdPartyAccess = createServerFn({
  method: 'POST',
})
  .inputValidator(
    (data: {
      userId: number;
      stravaId: number;
      stravaAccessToken: string;
      stravaCode: string;
    }) => data,
  )
  .handler(async ({data}) => {
    const env = getEnv();

    const response = await fetch(`${env.apiUrl}/users/third-party-access`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: data.userId,
        strava_id: data.stravaId,
        strava_access_token: data.stravaAccessToken,
        strava_code: data.stravaCode,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to save Strava access');
    }
  });

export const importActivities = createServerFn({
  method: 'POST',
})
  .inputValidator((data: {userId: number; from: Date; to: Date}) => data)
  .handler(async ({data}) => {
    const env = getEnv();

    const response = await fetch(`${env.apiUrl}/running/activities/import-activities`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: data.userId,
        from: data.from.toISOString(),
        to: data.to.toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to import activities');
    }
  });

export const getStravaAuthUrl = createServerFn({
  method: 'GET',
})
  .inputValidator((data: {redirectUri: string}) => data)
  .handler(async ({data}) => {
    const env = getEnv();

    const response = await fetch(
      `${env.apiUrl}/strava/oauth/url?redirect_uri=${encodeURIComponent(data.redirectUri)}`,
      {
        headers: {Authorization: `Bearer ${env.apiToken}`},
      },
    );

    if (!response.ok) {
      throw new Error('Failed to get Strava auth URL');
    }

    const result = await response.json();
    return result.url;
  });

export const handleStravaCallback = createServerFn({
  method: 'POST',
})
  .inputValidator((data: {code: string; userId: number}) => data)
  .handler(async ({data}) => {
    const env = getEnv();

    const response = await fetch(
      `${env.apiUrl}/strava/oauth/callback?code=${encodeURIComponent(data.code)}&user_id=${data.userId}`,
      {
        headers: {Authorization: `Bearer ${env.apiToken}`},
      },
    );

    if (!response.ok) {
      throw new Error('Failed to process Strava callback');
    }

    return response.json();
  });
