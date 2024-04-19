import { authenticator } from '../auth+/_services/auth.server.ts';

export async function getUser(request: Request) {
  const user = await authenticator.isAuthenticated(request);

  return user;
}
