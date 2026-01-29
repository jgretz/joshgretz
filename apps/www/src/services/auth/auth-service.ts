import type {ThirdPartyAccess, User} from './types';

const COOKIE_NAME = 'joshgretz-admin';
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60; // 7 days

export const setUserSession = (user: User) => {
  const encoded = btoa(JSON.stringify(user));
  document.cookie = `${COOKIE_NAME}=${encoded}; path=/; max-age=${COOKIE_MAX_AGE}; secure; samesite=lax`;
};

export const getUserSession = (): User | null => {
  if (typeof document === 'undefined') {
    return null;
  }

  const cookies = document.cookie.split(';');
  const sessionCookie = cookies.find((cookie) => cookie.trim().startsWith(`${COOKIE_NAME}=`));

  if (!sessionCookie) {
    return null;
  }

  try {
    const encoded = sessionCookie.split('=')[1];
    return JSON.parse(atob(encoded)) as User;
  } catch {
    return null;
  }
};

export const clearUserSession = () => {
  if (typeof document === 'undefined') {
    return;
  }

  document.cookie = `${COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
};

export const isAuthenticated = (): boolean => {
  const user = getUserSession();
  return user !== null && user.admin === true;
};

export type {User, ThirdPartyAccess};
