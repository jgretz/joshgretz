import {match} from 'ts-pattern';

const getApiUrl = (): string => {
  const envApiUrl = import.meta.env.VITE_API_URL as string | undefined;
  const nodeEnv = import.meta.env.NODE_ENV as string;

  if (envApiUrl) {
    return envApiUrl;
  }

  return match(nodeEnv)
    .with('development', () => 'http://localhost:3001')
    .with('production', () => 'https://joshgretz-api.fly.dev')
    .otherwise(() => 'http://localhost:3001');
};

export class ApiClient {
  private baseUrl: string;
  private authToken: string | null = null;

  constructor() {
    this.baseUrl = getApiUrl();
    if (typeof document !== 'undefined') {
      const cookies = document.cookie.split(';');
      const authCookie = cookies.find((cookie) => cookie.trim().startsWith('api-token='));
      if (authCookie) {
        this.authToken = authCookie.split('=')[1];
      }
    }
  }

  setAuthToken(token: string | null) {
    this.authToken = token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };

    if (this.authToken) {
      headers.Authorization = `Bearer ${this.authToken}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        error: 'An error occurred',
      }));
      const error = new Error(
        errorData.message || errorData.error || `HTTP ${response.status}: ${response.statusText}`,
      );
      (error as unknown as {status: number}).status = response.status;
      throw error;
    }

    return response.json();
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {method: 'GET'});
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }
}

export const apiClient = new ApiClient();
