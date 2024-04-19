// $ http GET "https://www.strava.com/api/v3/athlete" "Authorization: Bearer [[token]]"

import {Injectable} from '@nestjs/common';
import {StravaApiAthlete} from '../../StravaApiTypes';
import {GetFromStravaService} from './get_from_strava.service';

@Injectable()
export class GetStravaAthleteForUserService {
  constructor(private getFromStrava: GetFromStravaService) {}

  async get(user_id: number) {
    const url = `https://www.strava.com/api/v3/athlete`;
    return await this.getFromStrava.get<StravaApiAthlete>(url, user_id);
  }
}
