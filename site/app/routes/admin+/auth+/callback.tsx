import type {LoaderFunctionArgs} from '@remix-run/node';
import {authenticator} from './_services/auth.server';
import {ROUTES} from '../_constants/routes';

export function loader({request}: LoaderFunctionArgs) {
  return authenticator.authenticate('google', request, {
    successRedirect: ROUTES.ADMIN,
    failureRedirect: ROUTES.LOGIN,
  });
}
