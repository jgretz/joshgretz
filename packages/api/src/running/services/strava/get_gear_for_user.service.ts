import {Injectable} from '@nestjs/common';
import {GetStravaAthleteForUserService} from './get_strava_athlete_for_user.service';
import {GetGearDetailsService} from './get_gear_details.service';

@Injectable()
export class GetGearForUserService {
  constructor(
    private athleteService: GetStravaAthleteForUserService,
    private gearDetailsService: GetGearDetailsService,
  ) {}

  async getGearForUser(user_id: number) {
    const athlete = await this.athleteService.get(user_id);

    const gear = await Promise.all(
      athlete.shoes.map((shoe) => {
        return this.gearDetailsService.get(user_id, shoe.id);
      }),
    );

    return gear;
  }
}
