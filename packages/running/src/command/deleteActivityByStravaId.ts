import {Schema} from 'database';
import {eq, or} from 'drizzle-orm';
import type {RunningContainer} from '../Types';
import {InjectIn} from 'injectx';

const command = ({database}: RunningContainer) => {
  return async (stravaId: string): Promise<string | null> => {
    const activity = await database.query.activities.findFirst({
      where: eq(Schema.activities.strava_id, stravaId),
      columns: {id: true, start_date_local: true},
    });

    if (!activity) return null;

    await database.transaction(async (tx) => {
      // Unlink rather than blank the record: unlike an admin un-linking a PR, a deleted
      // activity does not mean the race never happened, so the denormalized race fields
      // stay and the public card still renders — just without a dead Strava link.
      // A PR can carry a strava_id with a stale activity_id (or the reverse), so match both.
      await tx
        .update(Schema.personalRecords)
        .set({activity_id: null, strava_id: null, updated_at: new Date()})
        .where(
          or(
            eq(Schema.personalRecords.activity_id, activity.id),
            eq(Schema.personalRecords.strava_id, stravaId),
          ),
        );

      await tx.delete(Schema.activities).where(eq(Schema.activities.strava_id, stravaId));
    });

    return activity.start_date_local ?? null;
  };
};

export const deleteActivityByStravaId = InjectIn(command);
