import {ROUTES} from '@admin/constants/routes';
import {authenticator} from '@admin/services/auth/auth.server';
import {type LoaderFunctionArgs} from '@remix-run/node';

export function loader({request}: LoaderFunctionArgs) {
  return authenticator.authenticate('google', request, {
    successRedirect: `${ROUTES.ADMIN}?auth=success`,
    failureRedirect: `${ROUTES.ADMIN}?auth=failure`,
  });
}
