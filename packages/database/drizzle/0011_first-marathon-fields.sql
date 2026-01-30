ALTER TABLE "state_stats" ADD COLUMN "first_marathon_name" varchar(300);--> statement-breakpoint
ALTER TABLE "state_stats" ADD COLUMN "first_marathon_date" timestamp;--> statement-breakpoint
ALTER TABLE "state_stats" ADD COLUMN "first_marathon_strava_id" varchar(50);