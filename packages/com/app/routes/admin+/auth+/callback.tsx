import { type LoaderFunctionArgs } from '@remix-run/node';
import { ROUTES } from '../_constants/routes.ts';
import { authenticator } from './_services/auth.server.ts';

export function loader({ request }: LoaderFunctionArgs) {
  return authenticator.authenticate('google', request, {
    successRedirect: ROUTES.ADMIN,
    failureRedirect: ROUTES.ADMIN,
  });
}
