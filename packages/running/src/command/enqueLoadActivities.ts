import type {Amqp} from 'amqp';
import type {User} from 'users';
import {Tasks, Queues} from '../Types';

export function enqueueLoadActivities(amqp: Amqp) {
  return async function (user: User, from: Date, to: Date) {
    await amqp.publish(
      Queues.Running,
      Tasks.LoadActivitiesSince,
      JSON.stringify({user_id: user.id, from, to}),
    );
  };
}
