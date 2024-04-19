import {Injectable} from '@nestjs/common';
import {desc, eq} from 'drizzle-orm';
import {stravaActivities} from 'src/db/schema';

import {DrizzleService} from 'src/db/services/db.service';

@Injectable()
export class GetLastKnownActivitityForUserService {
  constructor(private drizzle: DrizzleService) {}

  async get(user_id: number) {
    const activity = await this.drizzle.db.query.stravaActivities.findFirst({
      where: eq(stravaActivities.userId, user_id),
      orderBy: [desc(stravaActivities.start_date)],
    });

    return activity;
  }
}
