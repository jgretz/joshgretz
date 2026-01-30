CREATE TABLE IF NOT EXISTS "daily_stats" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"date" date NOT NULL,
	"total_miles" numeric,
	"run_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "daily_stats_user_id_idx" ON "daily_stats" ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "daily_stats_user_date_idx" ON "daily_stats" ("user_id","date");