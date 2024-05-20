import client from '../client';

export default async function loadActivitiesSince(user_id: number, date: Date) {
  await client.running.activities['load-since'].post({user_id, date});
}
