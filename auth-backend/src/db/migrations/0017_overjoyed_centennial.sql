CREATE UNIQUE INDEX IF NOT EXISTS "email_opens_idx" ON "email_opens" USING btree (contact_id,email_id);