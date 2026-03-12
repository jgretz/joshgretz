CREATE TABLE IF NOT EXISTS "thoughts" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(300) NOT NULL,
	"slug" varchar(300) NOT NULL,
	"content" text NOT NULL,
	"description" varchar(500),
	"tags" text[],
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "thoughts_slug_idx" ON "thoughts" ("slug");