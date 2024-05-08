DROP TABLE "tokens";--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "strava_id" integer;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "strava_access_token" varchar(50);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "strava_code" varchar(50);