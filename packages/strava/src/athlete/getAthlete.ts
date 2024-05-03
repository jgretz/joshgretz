import type {Athlete, StravaConfig} from '../Types';
import stravaRequest from '../stravaRequest';

export default function (config: StravaConfig) {
  const request = stravaRequest(config);

  return function () {
    return request<Athlete>(`/athlete`);
  };
}
