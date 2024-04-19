import {Injectable} from '@nestjs/common';
import {eq} from 'drizzle-orm';
import {stravaActivities} from 'src/db/schema';
import {DrizzleService} from 'src/db/services/db.service';

@Injectable()
export class GetActivitiesForUserService {
  constructor(private drizzle: DrizzleService) {}

  async get(userId: number) {
    const activities = await this.drizzle.db.query.stravaActivities.findMany({
      where: eq(stravaActivities.userId, userId),
    });

    return activities;
  }
}
