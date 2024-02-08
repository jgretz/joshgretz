import axios from 'axios';
import { type User } from '~/domain/security/Types.ts';
import { API_URLS } from '../../_constants/apiurls.ts';

export default async function findUserByEmail(email: string): Promise<User> {
  const url = API_URLS.FindUserByEmail + new URLSearchParams({ email });
  const response = await axios.get<User>(url);

  return response.data;
}
