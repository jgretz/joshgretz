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
ALTER TABLE "users" DROP COLUMN IF EXISTS "strava_code";