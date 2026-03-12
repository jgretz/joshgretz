import {createServerFn} from '@tanstack/react-start';

type Thought = {
  id: number;
  title: string;
  slug: string;
  content: string;
  description: string | null;
  tags: string[] | null;
  published_at: string | null;
  created_at: string | null;
  updated_at: string | null;
};

const getEnv = () => ({
  apiUrl: process.env.JOSHGRETZ_API_URL || 'http://localhost:3001',
  apiToken: process.env.HELMET || '',
});

export const getThoughts = createServerFn({
  method: 'GET',
}).handler(async (): Promise<Thought[]> => {
  const env = getEnv();
  const response = await fetch(`${env.apiUrl}/thoughts`, {
    headers: {Authorization: `Bearer ${env.apiToken}`},
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Failed to fetch thoughts: ${response.status} ${body}`);
  }
  return response.json();
});

export const getThought = createServerFn({
  method: 'GET',
})
  .inputValidator((data: {id: number}) => data)
  .handler(async ({data}): Promise<Thought | null> => {
    const env = getEnv();
    const response = await fetch(`${env.apiUrl}/thoughts/${data.id}`, {
      headers: {Authorization: `Bearer ${env.apiToken}`},
    });
    if (!response.ok) {
      if (response.status === 404) return null;
      const body = await response.text();
      throw new Error(`Failed to fetch thought: ${response.status} ${body}`);
    }
    return response.json();
  });

export const createThought = createServerFn({
  method: 'POST',
})
  .inputValidator(
    (data: {
      title: string;
      slug: string;
      content: string;
      description: string | null;
      tags: string[] | null;
      published_at: string | null;
    }) => data,
  )
  .handler(async ({data}): Promise<Thought> => {
    const env = getEnv();
    const response = await fetch(`${env.apiUrl}/thoughts`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Failed to create thought: ${response.status} ${body}`);
    }
    return response.json();
  });

export const updateThought = createServerFn({
  method: 'POST',
})
  .inputValidator(
    (data: {
      id: number;
      title: string;
      slug: string;
      content: string;
      description: string | null;
      tags: string[] | null;
      published_at: string | null;
    }) => data,
  )
  .handler(async ({data}): Promise<Thought> => {
    const env = getEnv();
    const {id, ...body} = data;
    const response = await fetch(`${env.apiUrl}/thoughts/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${env.apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Failed to update thought: ${response.status} ${body}`);
    }
    return response.json();
  });

export const deleteThought = createServerFn({
  method: 'POST',
})
  .inputValidator((data: {id: number}) => data)
  .handler(async ({data}) => {
    const env = getEnv();
    const response = await fetch(`${env.apiUrl}/thoughts/${data.id}`, {
      method: 'DELETE',
      headers: {Authorization: `Bearer ${env.apiToken}`},
    });
    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Failed to delete thought: ${response.status} ${body}`);
    }
  });
