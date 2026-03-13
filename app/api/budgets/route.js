import { NextResponse } from 'next/server';
import { db } from '@/utils/dbConfig';
import { Budgets, Transactions } from '@/utils/schema';
import { eq, getTableColumns, sql } from 'drizzle-orm';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

// GET - Fetch all budgets for a user
export async function GET(req) {
  try {
    const url = new URL(req.url);
    const userEmail = url.searchParams.get('email');

    if (!userEmail) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const result = await db.select({
      ...getTableColumns(Budgets),
      totalSpend: sql`COALESCE(SUM(${Transactions.amount}), 0)`.mapWith(Number),
      totalItem: sql`COUNT(${Transactions.id})`.mapWith(Number),
    })
    .from(Budgets)
    .leftJoin(Transactions, eq(Budgets.id, Transactions.budgetId))
    .where(eq(Budgets.createdBy, userEmail))
    .groupBy(Budgets.id)
    .orderBy(Budgets.id);

    const budgets = result.map(budget => ({
      ...budget,
      createdAt: budget.createdAt?.toISOString()
    }));

    return NextResponse.json({ budgets });
  } catch (error) {
    console.error('Error fetching budgets:', error);
    return NextResponse.json({ error: 'Failed to fetch budgets' }, { status: 500 });
  }
}

// POST - Create a new budget
export async function POST(req) {
  try {
    const { name, amount, icon, createdBy } = await req.json();

    if (!name || !amount || !createdBy) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const result = await db.insert(Budgets).values({
      name,
      amount: Number(amount),
      icon,
      createdBy
    }).returning();

    return NextResponse.json({ budget: result[0] }, { status: 201 });
  } catch (error) {
    console.error('Error creating budget:', error);
    return NextResponse.json({ error: 'Failed to create budget' }, { status: 500 });
  }
}