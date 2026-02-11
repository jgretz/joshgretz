ALTER TABLE "third_party_access" ADD COLUMN "google_access_token" varchar(2048);--> statement-breakpoint
ALTER TABLE "third_party_access" ADD COLUMN "google_refresh_token" varchar(512);--> statement-breakpoint
ALTER TABLE "third_party_access" ADD COLUMN "google_token_expires_at" timestamp;--> statement-breakpoint
ALTER TABLE "third_party_access" ADD COLUMN "google_spreadsheet_id" varchar(200);