ALTER TABLE "personal_records" ADD COLUMN "distance" varchar(50);--> statement-breakpoint
ALTER TABLE "personal_records" ADD COLUMN "pace_seconds" integer;--> statement-breakpoint
ALTER TABLE "personal_records" ADD COLUMN "race_name" varchar(300);--> statement-breakpoint
ALTER TABLE "personal_records" ADD COLUMN "race_location" varchar(300);--> statement-breakpoint
ALTER TABLE "personal_records" ADD COLUMN "strava_id" varchar(50);