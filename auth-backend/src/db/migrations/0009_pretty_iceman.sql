ALTER TABLE "campaign_users" RENAME TO "contacts";--> statement-breakpoint
ALTER TABLE "email_opens" RENAME COLUMN "campaign_user_id" TO "contact_id";--> statement-breakpoint
ALTER TABLE "email_queue" RENAME COLUMN "campaign_user_id" TO "contact_id";--> statement-breakpoint
ALTER TABLE "email_send_queue" RENAME COLUMN "campaign_user_id" TO "contact_id";--> statement-breakpoint
ALTER TABLE "user_campaign" RENAME COLUMN "campaign_user_id" TO "contact_id";--> statement-breakpoint
ALTER TABLE "contacts" DROP CONSTRAINT "campaign_users_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "email_opens" DROP CONSTRAINT "email_opens_campaign_user_id_campaign_users_id_fk";
--> statement-breakpoint
ALTER TABLE "email_queue" DROP CONSTRAINT "email_queue_campaign_user_id_campaign_users_id_fk";
--> statement-breakpoint
ALTER TABLE "email_send_queue" DROP CONSTRAINT "email_send_queue_campaign_user_id_campaign_users_id_fk";
--> statement-breakpoint
ALTER TABLE "user_campaign" DROP CONSTRAINT "user_campaign_campaign_user_id_campaign_users_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "contacts" ADD CONSTRAINT "contacts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "email_opens" ADD CONSTRAINT "email_opens_contact_id_contacts_id_fk" FOREIGN KEY ("contact_id") REFERENCES "public"."contacts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "email_queue" ADD CONSTRAINT "email_queue_contact_id_contacts_id_fk" FOREIGN KEY ("contact_id") REFERENCES "public"."contacts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "email_send_queue" ADD CONSTRAINT "email_send_queue_contact_id_contacts_id_fk" FOREIGN KEY ("contact_id") REFERENCES "public"."contacts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_campaign" ADD CONSTRAINT "user_campaign_contact_id_contacts_id_fk" FOREIGN KEY ("contact_id") REFERENCES "public"."contacts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
