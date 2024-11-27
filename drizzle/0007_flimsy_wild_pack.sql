ALTER TABLE "menupage" DROP CONSTRAINT "menupage_permission_id_permission_id_fk";
--> statement-breakpoint
ALTER TABLE "organization_person_role" DROP CONSTRAINT "organization_person_role_organization_id_organization_id_fk";
--> statement-breakpoint
ALTER TABLE "organization_person_role" DROP CONSTRAINT "organization_person_role_person_id_person_id_fk";
--> statement-breakpoint
ALTER TABLE "organization_person_role" DROP CONSTRAINT "organization_person_role_role_id_role_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "menupage" ADD CONSTRAINT "menupage_permission_id_permission_id_fk" FOREIGN KEY ("permission_id") REFERENCES "public"."permission"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "organization_person_role" ADD CONSTRAINT "organization_person_role_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "organization_person_role" ADD CONSTRAINT "organization_person_role_person_id_person_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."person"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "organization_person_role" ADD CONSTRAINT "organization_person_role_role_id_role_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."role"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
