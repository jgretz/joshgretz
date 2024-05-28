import type {User} from 'users';
import {Tasks, Queues, type RunningContainer} from '../Types';
import {InjectIn} from 'injectx';

function command({amqp}: RunningContainer) {
  return async function (user: User, from: Date, to: Date) {
    await amqp.publish(
      Queues.Running,
      Tasks.LoadActivitiesSince,
      JSON.stringify({user_id: user.id, from, to}),
    );
  };
}

export const enqueueLoadActivities = InjectIn(command);
