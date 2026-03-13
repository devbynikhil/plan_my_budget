ALTER TABLE "transactions" ADD COLUMN "nextDueDate" timestamp;--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "lastReminderSent" timestamp;