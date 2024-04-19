import {Controller, Post, Body} from '@nestjs/common';
import {GetActivitiesForUserDto} from '../dto/get_activities_for_user';
import {UpdateActivitiesForStravaUserService} from '../../services/update_user_activities.service';

@Controller('running/strava/import_activities')
export class StravaImportActivitiesController {
  constructor(private updateService: UpdateActivitiesForStravaUserService) {}

  @Post()
  async post(@Body() updateDto: GetActivitiesForUserDto) {
    return this.updateService.update(updateDto.user_id);
  }
}
