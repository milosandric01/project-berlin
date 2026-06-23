CREATE TABLE "topic_queue" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"published" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_admin" boolean DEFAULT false NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "topic_queue_slug_idx" ON "topic_queue" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "topic_queue_position_idx" ON "topic_queue" USING btree ("position");