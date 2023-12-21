import {Injectable} from '@nestjs/common';
import {eq} from 'drizzle-orm';
import {DrizzleService} from 'src/db/services/db.service';
import {users} from 'src/db/schema';

@Injectable()
export class FindUserByEmailService {
  constructor(private drizzle: DrizzleService) {}

  async get(email: string) {
    try {
      return await this.drizzle.db.query.users.findFirst({
        where: eq(users.email, email),
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
