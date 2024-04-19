import {Controller, Post, Body} from '@nestjs/common';
import {UpdateUserStravaAccessDetailsService} from '../../services/update_user_strava_access_details.service';
import {UpdateUserStravaAccessDetailsDto} from '../dto/update_user_strava_access_details';

@Controller('running/strava/access')
export class StravaAccessController {
  constructor(private service: UpdateUserStravaAccessDetailsService) {}

  @Post()
  async find(@Body() updateDto: UpdateUserStravaAccessDetailsDto) {
    return this.service.update(updateDto);
  }
}
