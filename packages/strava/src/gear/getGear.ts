import type {Gear} from '../Types';
import stravaRequest from '../stravaRequest';

export default function (gearId: number) {
  return stravaRequest<Gear>(`/gear/${gearId}`);
}
