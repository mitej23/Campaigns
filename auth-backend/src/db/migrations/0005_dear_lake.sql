CREATE TABLE IF NOT EXISTS "email_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" text NOT NULL,
	"subject" text NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "emails" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "emails" ADD COLUMN "template_id" uuid NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "email_templates" ADD CONSTRAINT "email_templates_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "user_template_name_idx" ON "email_templates" USING btree (user_id,name);--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "emails" ADD CONSTRAINT "emails_template_id_email_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."email_templates"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "emails" DROP COLUMN IF EXISTS "subject";--> statement-breakpoint
ALTER TABLE "emails" DROP COLUMN IF EXISTS "content";