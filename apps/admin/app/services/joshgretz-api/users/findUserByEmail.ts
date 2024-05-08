import client from '../client';

export default async function findUserByEmail(email: string) {
  const {data} = await client.users.query.get({query: {email}});

  return data;
}
