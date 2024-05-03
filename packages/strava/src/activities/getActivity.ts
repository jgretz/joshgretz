import type {Activity, StravaConfig} from '../Types';
import stravaRequest from '../stravaRequest';

export default function (config: StravaConfig) {
  const request = stravaRequest(config);

  return function (activityID: number) {
    return request<Activity>(`/activities/${activityID}`);
  };
}
