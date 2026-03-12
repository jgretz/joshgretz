import type {Database} from 'database';

export interface ThoughtsConfig {
  databaseUrl: string;
}

export interface ThoughtsContainer {
  database: Database;
}

export type Thought = {
  id: number;
  title: string;
  slug: string;
  content: string;
  description: string | null;
  tags: string[] | null;
  published_at: string | null;
  created_at: Date | null;
  updated_at: Date | null;
};

export type CreateThoughtInput = {
  title: string;
  slug: string;
  content: string;
  description?: string | null;
  tags?: string[] | null;
  published_at?: string | null;
};

export type UpdateThoughtInput = {
  title?: string;
  slug?: string;
  content?: string;
  description?: string | null;
  tags?: string[] | null;
  published_at?: string | null;
};
