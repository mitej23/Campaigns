ALTER TABLE "user_campaign" RENAME TO "campaign_contact";--> statement-breakpoint
ALTER TABLE "campaign_contact" DROP CONSTRAINT "user_campaign_contact_id_contacts_id_fk";
--> statement-breakpoint
ALTER TABLE "campaign_contact" DROP CONSTRAINT "user_campaign_campaign_id_campaigns_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "campaign_contact" ADD CONSTRAINT "campaign_contact_contact_id_contacts_id_fk" FOREIGN KEY ("contact_id") REFERENCES "public"."contacts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "campaign_contact" ADD CONSTRAINT "campaign_contact_campaign_id_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."campaigns"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
