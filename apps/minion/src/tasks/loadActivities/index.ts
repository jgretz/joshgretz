import {AMQPMessage} from '@cloudamqp/amqp-client';
import Users, {type User} from 'users';
import Strava, {setupStravaContainer} from 'strava';
import {parseISO} from 'date-fns';
import {Queues, Tasks} from 'running';
import {storeStravaActivity} from './services/storeStravaActivity';
import type {Task} from '../../Types';

const {
  queries: {thirdPartyAccessForUser},
} = Users;

const {
  queries: {getActivities},
} = Strava;

interface Args {
  user_id: number;
  from: string;
  to: string;
}

async function consume(message: AMQPMessage) {
  const args: Args = JSON.parse(message.bodyToString() || '{}');

  const access = await thirdPartyAccessForUser({id: args.user_id} as User);
  if (!access?.strava_access_token) {
    console.log(`No Strava access token found for user ${args.user_id}`);
    return;
  }

  setupStravaContainer({accessToken: access.strava_access_token});

  const activities = await getActivities({
    before: parseISO(args.to),
    after: parseISO(args.from),
  });

  await Promise.all(activities.map((activity) => storeStravaActivity(activity, args.user_id)));

  console.log(
    `Loaded ${activities.length} activities for user ${args.user_id} for ${args.from} - ${args.to}`,
  );
}

export const loadActivities = {
  queue: Queues.Running,
  message: Tasks.LoadActivitiesSince,

  consume,
} as Task;
