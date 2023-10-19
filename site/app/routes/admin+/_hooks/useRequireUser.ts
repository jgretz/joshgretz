import {authenticator} from '../_services/auth.server';

export async function useRequireUser(request: Request) {
  return await authenticator.authenticate('google', request);
}
