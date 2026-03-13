// schema.jsx
import { integer, numeric, pgTable, serial, varchar, timestamp } from "drizzle-orm/pg-core";

export const Budgets = pgTable('budgets', {
    id: serial('id').primaryKey(),
    name: varchar('name').notNull(),
    amount: numeric('amount').notNull(),
    icon: varchar('icon'),
    createdBy: varchar('createdBy').notNull(),
    category: varchar('category'), // NEW: category for budget
});

export const Transactions = pgTable('transactions', {
  id: serial('id').primaryKey(),
  amount: numeric('amount').notNull().default(0),
  name: varchar('name').notNull(),
  budgetId: integer('budgetId').references(() => Budgets.id),
  createdAt: timestamp('createdAt').defaultNow(),
  category: varchar('category'),           // New field
  recurring: varchar('recurring').default('none'), // New field
  nextDueDate: timestamp('nextDueDate'),   // New field for tracking next due date
  lastReminderSent: timestamp('lastReminderSent'), // New field to track when last reminder was sent
});