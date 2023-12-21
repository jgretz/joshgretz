import {Module} from '@nestjs/common';
import {StravaAccessController} from './controllers/access';
import {UpdateUserStravaAccessDetailsService} from './services/update_user_strava_access_details.service';
import {DrizzleService} from 'src/db/services/db.service';

@Module({
  controllers: [StravaAccessController],
  providers: [DrizzleService, UpdateUserStravaAccessDetailsService],
})
export class StravaModule {}
