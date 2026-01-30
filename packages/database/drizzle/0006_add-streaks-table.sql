CREATE TABLE IF NOT EXISTS "streaks" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"start_date" timestamp,
	"total_runs" integer,
	"total_miles" numeric,
	"total_vert" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "streak_user_id_idx" ON "streaks" ("user_id");