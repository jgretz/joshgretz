import type {User} from 'users';
import client from '../client';

export default async function getThirdPartyAccess(user: User) {
  const {data} = await client.users['third-party-access'].get({
    query: {user_id: user.id},
  });

  return data;
}
