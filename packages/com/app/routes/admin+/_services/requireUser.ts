import { authenticator } from '../auth+/_services/auth.server.ts';

export async function requireUser(request: Request) {
  return await authenticator.authenticate('google', request);
}
