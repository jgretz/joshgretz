import {User} from '~/Types';
import {API_URLS} from '../_constants/apiurls';

export default async function findUserByEmail(email: string) {
  const response = await fetch(API_URLS.FindUserByEmail + new URLSearchParams({email}));

  return (await response.json()) as User;
}
