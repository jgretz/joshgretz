import {Module} from '@nestjs/common';
import {DrizzleService} from 'src/db/services/db.service';
import {FindUserByEmailService} from './services/find_user_by_email.service';
import {UsersController} from './users.controller';

@Module({
  controllers: [UsersController],
  providers: [DrizzleService, FindUserByEmailService],
})
export class UsersModule {}
