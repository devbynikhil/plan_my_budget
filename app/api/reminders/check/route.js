import { NextResponse } from 'next/server';
import { db } from '@/utils/dbConfig';
import { Budgets, Transactions } from '@/utils/schema';
import { eq, and, lte, or, isNull } from 'drizzle-orm';
import { sendRecurringTransactionReminder } from '@/utils/emailService';
import { isToday } from '@/utils/recurringUtils';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

// GET - Check for due reminders and send emails
export async function GET(req) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today
    
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999); // End of today

    // Find all recurring transactions that are due today and haven't been reminded today
    const dueTransactions = await db
      .select({
        transactionId: Transactions.id,
        transactionName: Transactions.name,
        amount: Transactions.amount,
        category: Transactions.category,
        recurring: Transactions.recurring,
        nextDueDate: Transactions.nextDueDate,
        lastReminderSent: Transactions.lastReminderSent,
        userEmail: Budgets.createdBy,
        budgetName: Budgets.name,
      })
      .from(Transactions)
      .innerJoin(Budgets, eq(Budgets.id, Transactions.budgetId))
      .where(
        and(
          // Transaction is recurring (not 'none')
          eq(Transactions.recurring, 'daily') ||
          eq(Transactions.recurring, 'weekly') ||
          eq(Transactions.recurring, 'monthly') ||
          eq(Transactions.recurring, 'yearly'),
          
          // Next due date is today or past due
          lte(Transactions.nextDueDate, endOfDay),
          
          // Either no reminder sent today, or last reminder was not today
          or(
            isNull(Transactions.lastReminderSent),
            lte(Transactions.lastReminderSent, today)
          )
        )
      );

    const results = [];
    
    for (const transaction of dueTransactions) {
      // Check if we already sent a reminder today
      const lastReminder = transaction.lastReminderSent;
      if (lastReminder && isToday(lastReminder)) {
        continue; // Skip if already reminded today
      }

      // Send reminder email
      const emailResult = await sendRecurringTransactionReminder(
        transaction.userEmail,
        {
          name: transaction.transactionName,
          amount: transaction.amount,
          category: transaction.category,
          recurring: transaction.recurring,
        },
        new Date(transaction.nextDueDate)
      );

      if (emailResult.success) {
        // Update last reminder sent timestamp
        await db
          .update(Transactions)
          .set({ lastReminderSent: new Date() })
          .where(eq(Transactions.id, transaction.transactionId));

        results.push({
          transactionId: transaction.transactionId,
          userEmail: transaction.userEmail,
          status: 'sent',
          messageId: emailResult.messageId,
        });
      } else {
        results.push({
          transactionId: transaction.transactionId,
          userEmail: transaction.userEmail,
          status: 'failed',
          error: emailResult.error,
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${results.length} reminders`,
      results,
      totalDue: dueTransactions.length,
    });

  } catch (error) {
    console.error('Error checking reminders:', error);
    return NextResponse.json(
      { error: 'Failed to check reminders', details: error.message },
      { status: 500 }
    );
  }
}