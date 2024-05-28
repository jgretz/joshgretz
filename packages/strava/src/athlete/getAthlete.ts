import type {Athlete} from '../Types';
import stravaRequest from '../stravaRequest';

export default function () {
  return stravaRequest<Athlete>(`/athlete`);
}
