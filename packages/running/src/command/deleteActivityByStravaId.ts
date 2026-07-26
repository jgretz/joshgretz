import {Schema} from 'database';
import {eq, or} from 'drizzle-orm';
import type {RunningContainer} from '../Types';
import {InjectIn} from 'injectx';
import {findDuplicateActivityCandidates} from '../query/findDuplicateActivityCandidates';
import {
  chooseSurvivor,
  describeManualOverrides,
  manualOverridesFor,
} from '../services/manualActivityOverrides';

const command = ({database}: RunningContainer) => {
  return async (stravaId: string): Promise<string | null> => {
    const activity = await database.query.activities.findFirst({
      where: eq(Schema.activities.strava_id, stravaId),
      columns: {
        id: true,
        user_id: true,
        name: true,
        strava_id: true,
        start_date_local: true,
        start_lat: true,
        start_lng: true,
        location_city: true,
        location_state: true,
        location_country: true,
        featured_marathon: true,
      },
    });

    if (!activity) return null;

    // Detect first, query second. Every Strava delete webhook lands here, and
    // findDuplicateActivityCandidates is a self-join bounded only by `a.id < b.id` — measured at
    // ~1.3s for 4,000 activities. Only the rare row that carries hand-set values pays for it.
    const overrides = manualOverridesFor(activity);

    // The matcher reads outside the transaction below, so a concurrent delete could in principle
    // stale this choice. A single-operator admin plus a strava_id-scoped delete makes that
    // acceptable; the alternative is holding the quadratic join open inside the transaction.
    const survivor = overrides
      ? chooseSurvivor(
          await findDuplicateActivityCandidates({userId: activity.user_id}),
          activity.id,
        )
      : null;
    // Paired so the transaction below narrows both at once; `survivor` is only ever set when
    // `overrides` is.
    const carry = overrides && survivor ? {overrides, survivor} : null;

    // Warn and proceed. Refusing the delete would be a product decision, not this command's.
    if (overrides && !survivor) {
      console.warn(
        `Deleting activity "${activity.name}" (#${activity.id}, strava ${activity.strava_id}) ` +
          'destroys manual edits no re-import can restore, and no duplicate is in range to carry ' +
          `them to: ${describeManualOverrides(overrides)}`,
      );
    }

    await database.transaction(async (tx) => {
      // Carrying and deleting must be atomic in both directions: a failed delete must not leave a
      // mutated survivor, and a failed carry must not let the delete through. This is why the
      // logic lives here rather than in a service composed of separately-injected commands —
      // those cannot share a transaction.
      if (carry) {
        await tx
          .update(Schema.activities)
          .set(carry.overrides)
          .where(eq(Schema.activities.id, carry.survivor.id));
      }

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

    // Logged after the commit, so the line never claims a carry that rolled back.
    if (carry) {
      console.log(
        `Carried manual edits from activity #${activity.id} to #${carry.survivor.id}: ` +
          describeManualOverrides(carry.overrides),
      );
    }

    return activity.start_date_local ?? null;
  };
};

export const deleteActivityByStravaId = InjectIn(command);
