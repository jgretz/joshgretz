-- HAND-EDITED, unlike every other file in this directory.
--
-- When drizzle-kit generated this migration it emitted only the strava_activities ->
-- activities rename and silently dropped the accompanying column, type and index DDL.
-- meta/0002_snapshot.json was always correct, so `generate` sees no schema change and
-- has nothing to re-emit: only the SQL was recoverable, and only by hand. It had to be
-- restored here rather than in a new migration because 0019 references
-- activities.strava_id and dies before any later repair could run.
--
-- Editing an applied migration is safe here: drizzle's pg migrator compares only the
-- journal `when` against the newest applied row (the stored hash is written, never
-- checked), and production is applied through 0019, so 0002 never re-runs there.
--
-- The restored block therefore only ever executes against a from-scratch database, where
-- `activities` is empty. That is what makes `ADD COLUMN "strava_id" ... NOT NULL` and its
-- unique index safe with no backfill -- they would fail on a populated table. The
-- IF EXISTS / IF NOT EXISTS guards make the block a no-op against an already-modern
-- database; the one unguarded statement, the "start_date" retype, is idempotent.
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
-- Generated output ended above. Everything below is the restored DDL -- see the header.
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