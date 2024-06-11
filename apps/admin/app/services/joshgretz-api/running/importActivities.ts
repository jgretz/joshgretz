import client from '../client';

export default async function importActivities(user_id: number, from: Date, to: Date) {
  await client.running.activities['import-activities'].post({user_id, from, to});
}
