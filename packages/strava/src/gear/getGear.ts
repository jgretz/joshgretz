import type {Gear, StravaConfig} from '../Types';
import stravaRequest from '../stravaRequest';

export default function (config: StravaConfig) {
  const request = stravaRequest(config);

  return function (gearId: number) {
    return request<Gear>(`/gear/${gearId}`);
  };
}
