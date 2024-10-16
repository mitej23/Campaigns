ALTER TABLE "campaigns" ADD COLUMN "email_accounts_id" uuid NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_email_accounts_id_email_accounts_id_fk" FOREIGN KEY ("email_accounts_id") REFERENCES "public"."email_accounts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
