import {Module} from '@nestjs/common';
import {UsersModule} from './users/users.module';
import {RunningModule} from './running/running.module';

@Module({
  imports: [UsersModule, RunningModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
