import {Injectable} from '@nestjs/common';
import {eq} from 'drizzle-orm';
import {DrizzleService} from 'src/db/services/db.service';
import {users} from 'src/db/schema';
import {UpdateUserStravaAccessDetailsDto} from '../controllers/dto/update_user_strava_access_details';

@Injectable()
export class UpdateUserStravaAccessDetailsService {
  constructor(private drizzle: DrizzleService) {}

  async update({
    user_id,
    strava_id,
    strava_access_token,
    strava_code,
  }: UpdateUserStravaAccessDetailsDto) {
    const user = await this.drizzle.db.query.users.findFirst({
      where: eq(users.id, user_id),
    });

    if (!user) {
      throw new Error('User not found');
    }

    await this.drizzle.db
      .update(users)
      .set({
        strava_id,
        strava_access_token,
        strava_code,
      })
      .where(eq(users.id, user_id));
  }
}
