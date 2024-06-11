import type {Service} from 'workflow';
import {
  StravaCommands,
  StravaEvents,
  type LoadActivitiesForDateRangeRequest,
  type LoadActivitiesForDateRangeResponse,
} from '../Types';
import type {Event} from 'workflow';
import {setupStravaContainer} from 'strava';
import getActivities from '../activities/getActivities';
import {parseISO} from 'date-fns';

async function executeCommand({
  accessToken,
  from,
  to,
}: LoadActivitiesForDateRangeRequest): Promise<Event<LoadActivitiesForDateRangeResponse>> {
  setupStravaContainer({accessToken});

  const activities = await getActivities({before: parseISO(to), after: parseISO(from)});

  return {
    key: StravaEvents.LoadActivitiesForDateRangeResponse,

    payload: {
      activities,
    },
  };
}

export const LoadActivitiesForDateRange: Service = {
  key: StravaCommands.LoadActivitiesForDateRange,

  executeCommand,
};
