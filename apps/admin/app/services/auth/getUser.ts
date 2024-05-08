import {authenticator} from './auth.server';

export async function getUser(request: Request) {
  const user = await authenticator.isAuthenticated(request);

  return user;
}
