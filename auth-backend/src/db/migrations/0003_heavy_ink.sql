ALTER TABLE "campaigns" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "user_name_idx" ON "campaigns" USING btree (user_id,name);