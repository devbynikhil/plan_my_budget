import { NextResponse } from 'next/server';
import { db } from '@/utils/dbConfig';
import { Budgets, Transactions } from '@/utils/schema';
import { eq, getTableColumns, sql } from 'drizzle-orm';

// GET - Fetch a specific budget with transactions
export async function GET(req, { params }) {
  try {
    const { id } = params;
    const url = new URL(req.url);
    const userEmail = url.searchParams.get('email');

    if (!userEmail) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Get budget details
    const budgetResult = await db.select({
      ...getTableColumns(Budgets),
      totalSpend: sql`COALESCE(SUM(${Transactions.amount}), 0)`.mapWith(Number),
      totalItem: sql`COUNT(${Transactions.id})`.mapWith(Number),
    })
      .from(Budgets)
      .leftJoin(Transactions, eq(Budgets.id, Transactions.budgetId))
      .where(eq(Budgets.id, id))
      .groupBy(Budgets.id);

    if (budgetResult.length === 0) {
      return NextResponse.json({ error: 'Budget not found' }, { status: 404 });
    }

    // Get transactions for this budget
    const transactionsResult = await db.select({
      id: Transactions.id,
      name: Transactions.name,
      amount: Transactions.amount,
      createdAt: Transactions.createdAt,
      budgetId: Transactions.budgetId,
      category: Transactions.category,
    })
      .from(Transactions)
      .where(eq(Transactions.budgetId, id))
      .orderBy(Transactions.id);

    const budget = {
      ...budgetResult[0],
      createdAt: budgetResult[0].createdAt?.toISOString()
    };

    const transactions = transactionsResult.map(transaction => ({
      ...transaction,
      createdAt: transaction.createdAt?.toISOString()
    }));

    return NextResponse.json({ budget, transactions });
  } catch (error) {
    console.error('Error fetching budget:', error);
    return NextResponse.json({ error: 'Failed to fetch budget' }, { status: 500 });
  }
}

// PUT - Update a budget
export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const { name, amount, icon } = await req.json();

    if (!name || !amount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const result = await db.update(Budgets)
      .set({
        name,
        amount: Number(amount),
        icon
      })
      .where(eq(Budgets.id, id))
      .returning();

    if (result.length === 0) {
      return NextResponse.json({ error: 'Budget not found' }, { status: 404 });
    }

    return NextResponse.json({ budget: result[0] });
  } catch (error) {
    console.error('Error updating budget:', error);
    return NextResponse.json({ error: 'Failed to update budget' }, { status: 500 });
  }
}

// DELETE - Delete a budget and its transactions
export async function DELETE(req, { params }) {
  try {
    const { id } = params;

    // First delete all transactions for this budget
    await db.delete(Transactions)
      .where(eq(Transactions.budgetId, id));

    // Then delete the budget
    const result = await db.delete(Budgets)
      .where(eq(Budgets.id, id))
      .returning();

    if (result.length === 0) {
      return NextResponse.json({ error: 'Budget not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Budget deleted successfully' });
  } catch (error) {
    console.error('Error deleting budget:', error);
    return NextResponse.json({ error: 'Failed to delete budget' }, { status: 500 });
  }
}