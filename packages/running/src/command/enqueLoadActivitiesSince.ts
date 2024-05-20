import type {Amqp} from 'utility';
import type {User} from 'users';
import {Tasks, Queues} from '../Types';

export function enqueueLoadActivitiesSince(amqp: Amqp) {
  return async function (user: User, date: Date) {
    await amqp.publish(
      Queues.Running,
      Tasks.LoadActivitiesSince,
      JSON.stringify({user_id: user.id, date}),
    );
  };
}
