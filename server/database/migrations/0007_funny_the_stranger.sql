CREATE TABLE "topic_progress" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"topic_slug" text NOT NULL,
	"article_read" boolean DEFAULT false NOT NULL,
	"questions_correct" integer DEFAULT 0 NOT NULL,
	"questions_total" integer DEFAULT 0 NOT NULL,
	"completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "topic_progress" ADD CONSTRAINT "topic_progress_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "topic_progress_user_topic_idx" ON "topic_progress" USING btree ("user_id","topic_slug");--> statement-breakpoint
CREATE INDEX "topic_progress_user_idx" ON "topic_progress" USING btree ("user_id");