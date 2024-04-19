import {Controller, Get, Query} from '@nestjs/common';
import {FindUserByEmailService} from './services/find_user_by_email.service';

@Controller('users')
export class UsersController {
  constructor(private service: FindUserByEmailService) {}

  @Get()
  async find(@Query('email') email) {
    return this.service.get(email);
  }
}
