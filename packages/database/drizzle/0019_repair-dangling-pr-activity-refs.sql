-- Repair personal_records rows left pointing at activities deleted before the
-- delete-time unlink existed. The two references are nulled independently so a
-- row with a live activity_id but a stale strava_id keeps the good half.
UPDATE personal_records pr SET activity_id = NULL, updated_at = NOW()
WHERE pr.activity_id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM activities a WHERE a.id = pr.activity_id);
--> statement-breakpoint
UPDATE personal_records pr SET strava_id = NULL, updated_at = NOW()
WHERE pr.strava_id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM activities a WHERE a.strava_id = pr.strava_id);
