ALTER TABLE "topic_queue" ADD COLUMN "title" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "topic_queue" ADD COLUMN "subtitle" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "topic_queue" ADD COLUMN "category" text DEFAULT 'General' NOT NULL;--> statement-breakpoint
ALTER TABLE "topic_queue" ADD COLUMN "read_minutes" integer DEFAULT 3 NOT NULL;--> statement-breakpoint
ALTER TABLE "topic_queue" ADD COLUMN "article_markdown" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "topic_queue" ADD COLUMN "questions" text DEFAULT '[]' NOT NULL;