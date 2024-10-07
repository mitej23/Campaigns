DROP INDEX IF EXISTS "user_name_idx";--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "user_id_campaign_name_idx" ON "campaigns" USING btree (user_id,name);