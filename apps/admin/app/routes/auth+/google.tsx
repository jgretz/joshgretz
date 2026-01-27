import {authenticator} from '@admin/services/auth/auth.server';
import {type ActionFunctionArgs, redirect} from '@remix-run/node';

export function loader() {
  return redirect('/login');
}

export function action({request}: ActionFunctionArgs) {
  return authenticator.authenticate('google', request);
}
