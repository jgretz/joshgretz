import client from '../client';

export default async function loadActivities(user_id: number, from: Date, to: Date) {
  await client.running.activities['load-activities'].post({user_id, from, to});
}
