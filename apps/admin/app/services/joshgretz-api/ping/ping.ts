import client from '../client';

export default async function ping() {
  return await client.ping.get();
}
