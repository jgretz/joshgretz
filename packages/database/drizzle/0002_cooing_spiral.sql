CREATE TABLE IF NOT EXISTS "gear" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"gear_id" varchar(100) NOT NULL,
	"brand_name" varchar(300),
	"model_name" varchar(300),
	"description" varchar(300),
	"resource_state" integer,
	"distance" numeric
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "third_party_access" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" numeric NOT NULL,
	"strava_id" integer,
	"strava_access_token" varchar(50),
	"strava_code" varchar(50)
);
--> statement-breakpoint
ALTER TABLE "strava_activities" RENAME TO "activities";--> statement-breakpoint
DROP INDEX IF EXISTS "email_idx";--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "gear_user_id_idx" ON "gear" ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "gear_strava_id_idx" ON "gear" ("gear_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "third_party_access_user_idx" ON "third_party_access" ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "users_email_idx" ON "users" ("email");--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "strava_id";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "strava_access_token";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "strava_code";--> statement-breakpoint
-- Everything below was lost when this migration was originally generated: the file kept
-- only the strava_activities -> activities rename and dropped the accompanying column,
-- type and index DDL, so meta/0002_snapshot.json (correct) and this SQL disagreed and a
-- from-scratch `db:migrate` died in 0019 on a missing activities.strava_id. Restored in
-- place rather than as a new migration because 0019 fails before any later repair could
-- run. Production applied through 0019 and drizzle compares only the journal `when`, so
-- 0002 is skipped there; every statement is guarded regardless.
ALTER TABLE "activities" DROP CONSTRAINT IF EXISTS "strava_activities_user_id_users_id_fk";--> statement-breakpoint
ALTER TABLE "activities" DROP COLUMN IF EXISTS "elevation_gain";--> statement-breakpoint
ALTER TABLE "activities" DROP COLUMN IF EXISTS "latitude";--> statement-breakpoint
ALTER TABLE "activities" DROP COLUMN IF EXISTS "longitude";--> statement-breakpoint
ALTER TABLE "activities" DROP COLUMN IF EXISTS "city";--> statement-breakpoint
ALTER TABLE "activities" DROP COLUMN IF EXISTS "state";--> statement-breakpoint
ALTER TABLE "activities" DROP COLUMN IF EXISTS "country";--> statement-breakpoint
ALTER TABLE "activities" ALTER COLUMN "start_date" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "activities" ADD COLUMN IF NOT EXISTS "strava_id" varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE "activities" ADD COLUMN IF NOT EXISTS "total_elevation_gain" numeric;--> statement-breakpoint
ALTER TABLE "activities" ADD COLUMN IF NOT EXISTS "start_date_local" timestamp;--> statement-breakpoint
ALTER TABLE "activities" ADD COLUMN IF NOT EXISTS "timezone" varchar(50);--> statement-breakpoint
ALTER TABLE "activities" ADD COLUMN IF NOT EXISTS "utc_offset" integer;--> statement-breakpoint
ALTER TABLE "activities" ADD COLUMN IF NOT EXISTS "start_lat" numeric;--> statement-breakpoint
ALTER TABLE "activities" ADD COLUMN IF NOT EXISTS "start_lng" numeric;--> statement-breakpoint
ALTER TABLE "activities" ADD COLUMN IF NOT EXISTS "stop_lat" numeric;--> statement-breakpoint
ALTER TABLE "activities" ADD COLUMN IF NOT EXISTS "stop_lng" numeric;--> statement-breakpoint
ALTER TABLE "activities" ADD COLUMN IF NOT EXISTS "location_city" varchar(100);--> statement-breakpoint
ALTER TABLE "activities" ADD COLUMN IF NOT EXISTS "location_state" varchar(100);--> statement-breakpoint
ALTER TABLE "activities" ADD COLUMN IF NOT EXISTS "location_country" varchar(100);--> statement-breakpoint
ALTER TABLE "activities" ADD COLUMN IF NOT EXISTS "gear_id" varchar(100);--> statement-breakpoint
ALTER TABLE "activities" ADD COLUMN IF NOT EXISTS "average_speed" numeric;--> statement-breakpoint
ALTER TABLE "activities" ADD COLUMN IF NOT EXISTS "max_speed" numeric;--> statement-breakpoint
ALTER TABLE "activities" ADD COLUMN IF NOT EXISTS "average_cadence" numeric;--> statement-breakpoint
ALTER TABLE "activities" ADD COLUMN IF NOT EXISTS "average_watts" numeric;--> statement-breakpoint
ALTER TABLE "activities" ADD COLUMN IF NOT EXISTS "max_watts" numeric;--> statement-breakpoint
ALTER TABLE "activities" ADD COLUMN IF NOT EXISTS "average_heartrate" numeric;--> statement-breakpoint
ALTER TABLE "activities" ADD COLUMN IF NOT EXISTS "max_heartrate" numeric;--> statement-breakpoint
ALTER TABLE "activities" ADD COLUMN IF NOT EXISTS "elev_high" numeric;--> statement-breakpoint
ALTER TABLE "activities" ADD COLUMN IF NOT EXISTS "elev_low" numeric;--> statement-breakpoint
ALTER TABLE "activities" ADD COLUMN IF NOT EXISTS "suffer_score" numeric;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "activity_user_id_idx" ON "activities" ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "activity_strava_id_idx" ON "activities" ("strava_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "activity_lat_lon_idx" ON "activities" ("start_lat","start_lng");