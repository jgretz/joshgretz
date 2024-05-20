import type {AmqpWrapper} from 'utility';
import type {User} from 'users';
import {Commands, Queues} from '../Types';

export function enqueueLoadActivitiesSince(amqp: AmqpWrapper) {
  return async function (user: User, date: Date) {
    await amqp.publish(
      Queues.Running,
      Commands.LoadActivitiesSince,
      JSON.stringify({user_id: user.id, date}),
    );
  };
}
