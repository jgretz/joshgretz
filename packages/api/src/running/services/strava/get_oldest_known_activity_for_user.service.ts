import {Injectable} from '@nestjs/common';
import {asc, eq} from 'drizzle-orm';
import {stravaActivities} from 'src/db/schema';

import {DrizzleService} from 'src/db/services/db.service';

@Injectable()
export class GetOldestKnownActivitityForUserService {
  constructor(private drizzle: DrizzleService) {}

  async get(user_id: number) {
    const activity = await this.drizzle.db.query.stravaActivities.findFirst({
      where: eq(stravaActivities.userId, user_id),
      orderBy: [asc(stravaActivities.start_date)],
    });

    return activity;
  }
}
