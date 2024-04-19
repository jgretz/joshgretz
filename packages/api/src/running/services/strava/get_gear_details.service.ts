// $ http GET "https://www.strava.com/api/v3/gear/{id}" "Authorization: Bearer [[token]]"

import {Injectable} from '@nestjs/common';
import {StravaApiGear} from '../../StravaApiTypes';
import {GetFromStravaService} from './get_from_strava.service';

@Injectable()
export class GetGearDetailsService {
  constructor(private getFromStrava: GetFromStravaService) {}

  async get(user_id: number, gear_id: string) {
    const url = `https://www.strava.com/api/v3/gear/${gear_id}`;
    return await this.getFromStrava.get<StravaApiGear>(url, user_id);
  }
}
