ALTER TABLE "menu_page" RENAME TO "menupage";--> statement-breakpoint
ALTER TABLE "menupage" DROP CONSTRAINT "menu_page_permission_id_permission_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "menupage" ADD CONSTRAINT "menupage_permission_id_permission_id_fk" FOREIGN KEY ("permission_id") REFERENCES "public"."permission"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "menupage" DROP COLUMN IF EXISTS "sort";