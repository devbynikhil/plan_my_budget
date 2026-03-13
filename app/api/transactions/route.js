import { NextResponse } from 'next/server';
import { db } from '@/utils/dbConfig';
import { Budgets, Transactions } from '@/utils/schema';
import { eq, desc, getTableColumns, sql } from 'drizzle-orm';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

// GET - Fetch transactions for a user with pagination
export async function GET(req) {
  try {
    const url = new URL(req.url);
    const userEmail = url.searchParams.get('email');
    const page = parseInt(url.searchParams.get('page') || "1");
    const limit = parseInt(url.searchParams.get('limit') || "10");
    const offset = (page - 1) * limit;

    if (!userEmail) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Get total count
    const totalCountRes = await db
      .select({ count: sql`COUNT(${Transactions.id})`.mapWith(Number) })
      .from(Budgets)
      .rightJoin(Transactions, eq(Budgets.id, Transactions.budgetId))
      .where(eq(Budgets.createdBy, userEmail));
    
    const totalTransactions = totalCountRes[0]?.count || 0;

    // Get transactions with pagination
    const result = await db.select({
      id: Transactions.id,
      name: Transactions.name,
      amount: Transactions.amount,
      createdAt: Transactions.createdAt,
      budgetId: Transactions.budgetId,
      category: Transactions.category,
    })
    .from(Budgets)
    .rightJoin(Transactions, eq(Budgets.id, Transactions.budgetId))
    .where(eq(Budgets.createdBy, userEmail))
    .orderBy(desc(Transactions.id))
    .limit(limit)
    .offset(offset);

    const transactions = result.map(transaction => ({
      ...transaction,
      createdAt: transaction.createdAt?.toISOString()
    }));

    return NextResponse.json({
      transactions,
      totalTransactions,
      page,
      limit,
      totalPages: Math.ceil(totalTransactions / limit)
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}

// POST - Create a new transaction
export async function POST(req) {
  try {
    const { name, amount, budgetId, category, recurring = 'none' } = await req.json();

    if (!name || !amount || !budgetId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Calculate next due date if recurring
    let nextDueDate = null;
    if (recurring && recurring !== 'none') {
      const { calculateNextDueDate } = await import('@/utils/recurringUtils');
      nextDueDate = calculateNextDueDate(new Date(), recurring);
    }

    const result = await db.insert(Transactions).values({
      name,
      amount: Number(amount),
      budgetId: Number(budgetId),
      category,
      recurring,
      nextDueDate,
      createdAt: new Date()
    }).returning();

    return NextResponse.json({ transaction: result[0] }, { status: 201 });
  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 });
  }
}