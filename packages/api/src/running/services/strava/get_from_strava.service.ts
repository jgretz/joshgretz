import {Injectable} from '@nestjs/common';
import axios from 'axios';
import {eq} from 'drizzle-orm';
import {users} from 'src/db/schema';
import {DrizzleService} from 'src/db/services/db.service';

@Injectable()
export class GetFromStravaService {
  constructor(private drizzle: DrizzleService) {}

  async get<T>(url: string, user_id: number) {
    const user = await this.drizzle.db.query.users.findFirst({
      where: eq(users.id, user_id),
    });

    if (!user) {
      throw new Error('User not found');
    }

    const response = await axios.get<T>(url, {
      headers: {
        Authorization: `Bearer ${user.strava_access_token}`,
      },
    });

    return response.data;
  }
}
