CREATE TABLE IF NOT EXISTS "jobs" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" varchar(50) NOT NULL,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"payload" jsonb NOT NULL,
	"result" jsonb,
	"error_message" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"started_at" timestamp,
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "personal_records" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"title" varchar(200) NOT NULL,
	"time_seconds" integer NOT NULL,
	"activity_id" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "third_party_access" ALTER COLUMN "strava_access_token" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "third_party_access" ADD COLUMN "strava_refresh_token" varchar(100);--> statement-breakpoint
ALTER TABLE "third_party_access" ADD COLUMN "strava_token_expires_at" timestamp;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "jobs_status_idx" ON "jobs" ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "jobs_type_idx" ON "jobs" ("type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "pr_user_id_idx" ON "personal_records" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "pr_activity_id_idx" ON "personal_records" ("activity_id");