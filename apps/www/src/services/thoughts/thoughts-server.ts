import {createServerFn} from '@tanstack/react-start';

export type Thought = {
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

function getEnv() {
  return {
    apiUrl: process.env.JOSHGRETZ_API_URL || 'http://localhost:3001',
    apiToken: process.env.HELMET || '',
  };
}

export const getPublishedThoughts = createServerFn({
  method: 'GET',
}).handler(async (): Promise<Thought[]> => {
  const env = getEnv();
  const response = await fetch(`${env.apiUrl}/thoughts/published`, {
    headers: {Authorization: `Bearer ${env.apiToken}`},
  });
  if (!response.ok) throw new Error('Failed to fetch published thoughts');
  return response.json();
});

export const getThoughtBySlug = createServerFn({
  method: 'GET',
})
  .inputValidator((data: {slug: string}) => data)
  .handler(async ({data}): Promise<Thought | null> => {
    const env = getEnv();
    const response = await fetch(`${env.apiUrl}/thoughts/slug/${data.slug}`, {
      headers: {Authorization: `Bearer ${env.apiToken}`},
    });
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error('Failed to fetch thought');
    }
    return response.json();
  });
