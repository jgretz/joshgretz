import {LoaderFunctionArgs, json, redirect} from '@remix-run/node';
import {useRequireUser} from './_hooks/useRequireUser';
import {ROUTES} from './_constants/routes';

export async function loader({request}: LoaderFunctionArgs) {
  const user = await useRequireUser(request);
  if (!user) {
    return redirect(ROUTES.LOGIN);
  }

  return json({});
}

export default function Strava() {
  return (
    <div>
      <button>Connect Strava</button>
    </div>
  );
}
