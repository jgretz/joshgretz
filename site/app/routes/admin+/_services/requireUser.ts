import {authenticator} from '../auth+/_services/auth.server';

export async function requireUser(request: Request) {
  return await authenticator.authenticate('google', request);
}
