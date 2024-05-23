import {AMQPMessage} from '@cloudamqp/amqp-client';
import type {Database} from 'database';
import {thirdPartyAccessForUser, type User} from 'users';
import Strava from 'strava';
import {parseISO} from 'date-fns';
import {Queues, Tasks} from '../Types';
import type {Task} from 'amqp';
import storeStravaActivity from './services/storeStravaActivity';
import type {Geo} from 'packages/geoapify/src';

interface Args {
  user_id: number;
  from: string;
  to: string;
}

function handle(database: Database, geo: Geo) {
  return async function (message: AMQPMessage) {
    const args: Args = JSON.parse(message.bodyToString() || '{}');

    const access = await thirdPartyAccessForUser(database)({id: args.user_id} as User);
    if (!access?.strava_access_token) {
      console.log(`No Strava access token found for user ${args.user_id}`);
      return;
    }

    const activities = await Strava({accessToken: access.strava_access_token}).getActivities({
      before: parseISO(args.to),
      after: parseISO(args.from),
    });

    await Promise.all(
      activities.map((activity) => storeStravaActivity(database, geo, args.user_id)(activity)),
    );

    console.log(
      `Loaded ${activities.length} activities for user ${args.user_id} for ${args.from} - ${args.to}`,
    );
  };
}

export default function (database: Database, geo: Geo) {
  return {
    queue: Queues.Running,
    message: Tasks.LoadActivitiesSince,

    consume: handle(database, geo),
  } as Task;
}
