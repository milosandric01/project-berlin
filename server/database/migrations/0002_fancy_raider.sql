CREATE TABLE "flow_skills" (
	"id" serial PRIMARY KEY NOT NULL,
	"flow_id" integer NOT NULL,
	"skill_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "flows" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"name" text NOT NULL,
	"predefined_key" text,
	"is_active" boolean DEFAULT false NOT NULL,
	"total_questions" integer DEFAULT 0 NOT NULL,
	"last_practiced_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "flow_skills" ADD CONSTRAINT "flow_skills_flow_id_flows_id_fk" FOREIGN KEY ("flow_id") REFERENCES "public"."flows"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "flow_skills" ADD CONSTRAINT "flow_skills_skill_id_skills_id_fk" FOREIGN KEY ("skill_id") REFERENCES "public"."skills"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "flows" ADD CONSTRAINT "flows_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "flow_skills_flow_skill_idx" ON "flow_skills" USING btree ("flow_id","skill_id");--> statement-breakpoint
CREATE INDEX "flow_skills_flow_idx" ON "flow_skills" USING btree ("flow_id");--> statement-breakpoint
CREATE INDEX "flows_user_idx" ON "flows" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "flows_user_active_idx" ON "flows" USING btree ("user_id","is_active");