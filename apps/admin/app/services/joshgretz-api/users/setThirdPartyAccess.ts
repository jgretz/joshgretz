import type {User} from 'users';
import client from '../client';

interface StravaAccess {
  strava_id: number;
  strava_access_token: string;
  strava_code: string;
}

export default async function setThirdPartyAccess(user: User, access: StravaAccess) {
  const body = {
    user_id: user.id,
    strava_id: access.strava_id,
    strava_access_token: access.strava_access_token,
    strava_code: access.strava_code,
  };

  await client.users['third-party-access'].post(body);
}
