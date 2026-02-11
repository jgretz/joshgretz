import {createServerFn} from '@tanstack/react-start';

const getEnv = () => ({
  apiUrl: process.env.JOSHGRETZ_API_URL || 'http://localhost:3001',
  apiToken: process.env.HELMET || '',
});

export const getGoogleSheetsAuthUrl = createServerFn({
  method: 'GET',
})
  .inputValidator((data: {redirectUri: string}) => data)
  .handler(async ({data}) => {
    const env = getEnv();

    const response = await fetch(
      `${env.apiUrl}/google-sheets/oauth/url?redirect_uri=${encodeURIComponent(data.redirectUri)}`,
      {
        headers: {Authorization: `Bearer ${env.apiToken}`},
      },
    );

    if (!response.ok) {
      throw new Error('Failed to get Google Sheets auth URL');
    }

    const result = await response.json();
    return result.url as string;
  });

export const handleGoogleSheetsCallback = createServerFn({
  method: 'POST',
})
  .inputValidator((data: {code: string; userId: number; redirectUri: string}) => data)
  .handler(async ({data}) => {
    const env = getEnv();

    const params = new URLSearchParams({
      code: data.code,
      user_id: String(data.userId),
      redirect_uri: data.redirectUri,
    });

    const response = await fetch(`${env.apiUrl}/google-sheets/oauth/callback?${params}`, {
      headers: {Authorization: `Bearer ${env.apiToken}`},
    });

    if (!response.ok) {
      throw new Error('Failed to process Google Sheets callback');
    }

    return response.json();
  });

export const saveSpreadsheetId = createServerFn({
  method: 'POST',
})
  .inputValidator((data: {userId: number; spreadsheetId: string}) => data)
  .handler(async ({data}) => {
    const env = getEnv();

    const response = await fetch(`${env.apiUrl}/google-sheets/config`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: data.userId,
        spreadsheet_id: data.spreadsheetId,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to save spreadsheet ID');
    }
  });

export const triggerGoogleSheetsSync = createServerFn({
  method: 'POST',
})
  .inputValidator(
    (data: {userId: number; from?: string; to?: string; fullSync?: boolean}) => data,
  )
  .handler(async ({data}) => {
    const env = getEnv();

    const response = await fetch(`${env.apiUrl}/google-sheets/sync`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: data.userId,
        from: data.from,
        to: data.to,
        full_sync: data.fullSync,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to trigger Google Sheets sync');
    }
  });
