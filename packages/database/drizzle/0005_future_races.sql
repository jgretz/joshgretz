CREATE TABLE IF NOT EXISTS "future_races" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"title" varchar(200) NOT NULL,
	"location" varchar(300),
	"distance" varchar(100),
	"url" varchar(500),
	"race_date" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "future_race_user_id_idx" ON "future_races" ("user_id");