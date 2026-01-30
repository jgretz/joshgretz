CREATE TABLE IF NOT EXISTS "state_stats" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"state" varchar(2) NOT NULL,
	"run_count" integer DEFAULT 0,
	"marathon_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "state_stats_user_id_idx" ON "state_stats" ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "state_stats_user_state_idx" ON "state_stats" ("user_id","state");