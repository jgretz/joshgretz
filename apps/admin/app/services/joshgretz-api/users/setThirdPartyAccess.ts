import type {ThirdPartyAccess, User} from 'users';
import client from '../client';

export default async function setThirdPartyAccess(user: User, access: ThirdPartyAccess) {
  const body = {
    user_id: user.id,
    strava_id: access.strava_id!,
    strava_access_token: access.strava_access_token!,
    strava_code: access.strava_code!,
  };

  await client.users['third-party-access'].post(body);
}
