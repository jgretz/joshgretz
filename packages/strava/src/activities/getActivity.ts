import type {Activity} from '../Types';
import stravaRequest from '../stravaRequest';

export default function (activityID: string) {
  return stravaRequest<Activity>(`/activities/${activityID}`);
}
