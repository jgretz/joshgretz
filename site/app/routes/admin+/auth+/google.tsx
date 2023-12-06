import type {ActionFunctionArgs} from '@remix-run/node';
import {redirect} from '@remix-run/node';
import {ROUTES} from '../_constants/routes';
import {authenticator} from './_services/auth.server';

export function loader() {
  return redirect(ROUTES.LOGIN);
}

export let action = ({request}: ActionFunctionArgs) => {
  return authenticator.authenticate('google', request);
};
