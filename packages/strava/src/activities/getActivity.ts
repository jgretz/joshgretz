import type {Activity} from '../Types';
import stravaRequest from '../stravaRequest';

export default function (activityID: number) {
  return stravaRequest<Activity>(`/activities/${activityID}`);
}
