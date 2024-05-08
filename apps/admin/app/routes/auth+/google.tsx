import {redirect, type ActionFunctionArgs} from '@remix-run/node';
import {authenticator} from '@admin/services/auth/auth.server';

export function loader() {
  return redirect('/login');
}

export function action({request}: ActionFunctionArgs) {
  return authenticator.authenticate('google', request);
}
