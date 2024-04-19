import { type ActionFunctionArgs } from '@remix-run/node';
import { authenticator } from './_services/auth.server.ts';

export let action = ({ request }: ActionFunctionArgs) => {
  return authenticator.authenticate('google', request);
};
