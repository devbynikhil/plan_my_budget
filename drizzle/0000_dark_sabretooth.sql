CREATE TABLE IF NOT EXISTS "budgets" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"amount" numeric NOT NULL,
	"icon" varchar,
	"createdBy" varchar NOT NULL,
	"category" varchar
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"amount" numeric DEFAULT 0 NOT NULL,
	"name" varchar NOT NULL,
	"budgetId" integer,
	"createdAt" timestamp DEFAULT now(),
	"category" varchar,
	"recurring" varchar DEFAULT 'none'
);
--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_budgetId_budgets_id_fk" FOREIGN KEY ("budgetId") REFERENCES "public"."budgets"("id") ON DELETE no action ON UPDATE no action;