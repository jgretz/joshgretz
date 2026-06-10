import {createServerFn} from '@tanstack/react-start';

export type FileKind = 'image' | 'markdown';

export type FileListItem = {
  id: number;
  slug: string;
  original_filename: string;
  mime_type: string;
  size_bytes: number;
  created_at: string | null;
  updated_at: string | null;
};

export type FileDetail = FileListItem & {
  kind: FileKind;
  content: string | null;
};

const getEnv = () => ({
  apiUrl: process.env.JOSHGRETZ_API_URL || 'http://localhost:3001',
  apiToken: process.env.HELMET || '',
});

export const getFiles = createServerFn({
  method: 'GET',
}).handler(async (): Promise<FileListItem[]> => {
  const env = getEnv();
  const response = await fetch(`${env.apiUrl}/files`, {
    headers: {Authorization: `Bearer ${env.apiToken}`},
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Failed to fetch files: ${response.status} ${body}`);
  }
  return response.json();
});

export const getFileBySlug = createServerFn({
  method: 'GET',
})
  .inputValidator((data: {slug: string}) => data)
  .handler(async ({data}): Promise<FileDetail | null> => {
    const env = getEnv();
    const response = await fetch(`${env.apiUrl}/files/slug/${data.slug}`, {
      headers: {Authorization: `Bearer ${env.apiToken}`},
    });
    if (!response.ok) {
      if (response.status === 404) return null;
      const body = await response.text();
      throw new Error(`Failed to fetch file: ${response.status} ${body}`);
    }
    return response.json();
  });

export const createFile = createServerFn({
  method: 'POST',
})
  .inputValidator((data: {filename: string; slug: string | null; dataBase64: string}) => data)
  .handler(async ({data}): Promise<FileListItem & {kind: FileKind}> => {
    const env = getEnv();
    const response = await fetch(`${env.apiUrl}/files`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Failed to upload file: ${response.status} ${body}`);
    }
    return response.json();
  });

export const updateFileSlug = createServerFn({
  method: 'POST',
})
  .inputValidator((data: {id: number; slug: string}) => data)
  .handler(async ({data}): Promise<FileListItem & {kind: FileKind}> => {
    const env = getEnv();
    const response = await fetch(`${env.apiUrl}/files/${data.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${env.apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({slug: data.slug}),
    });
    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Failed to update slug: ${response.status} ${body}`);
    }
    return response.json();
  });

export const deleteFile = createServerFn({
  method: 'POST',
})
  .inputValidator((data: {id: number}) => data)
  .handler(async ({data}): Promise<void> => {
    const env = getEnv();
    const response = await fetch(`${env.apiUrl}/files/${data.id}`, {
      method: 'DELETE',
      headers: {Authorization: `Bearer ${env.apiToken}`},
    });
    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Failed to delete file: ${response.status} ${body}`);
    }
  });
