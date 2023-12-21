import {Module} from '@nestjs/common';
import {UsersModule} from './users/users.module';
import {StravaModule} from './strava/strava.module';

@Module({
  imports: [UsersModule, StravaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
