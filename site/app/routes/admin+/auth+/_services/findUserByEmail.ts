import {User} from '~/Types';
import {API_URLS} from '../../_constants/apiUrls';
import axios from 'axios';

export default async function findUserByEmail(email: string): Promise<User> {
  const url = API_URLS.FindUserByEmail + new URLSearchParams({email});
  const response = await axios.get<User>(url);

  return response.data;
}
