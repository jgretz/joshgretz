import type {LoaderFunctionArgs} from '@remix-run/node';
import {ROUTES} from '../_constants/routes';

export function loader({request}: LoaderFunctionArgs): {} {
  const url = new URL(request.url);
  const token = url.searchParams.get('code');

  console.log(token);

  return {};
}
