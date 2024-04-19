import {Controller, Query, Get} from '@nestjs/common';
import {GetActivitiesForUserDto} from '../dto/get_activities_for_user';
import {GetActivitiesForUserService} from 'src/running/services/get_activities_for_user.service';

@Controller('running/activities')
export class RunningActivitiesController {
  constructor(private getService: GetActivitiesForUserService) {}

  @Get()
  async get(@Query() query: GetActivitiesForUserDto) {
    return this.getService.get(query.user_id);
  }
}
