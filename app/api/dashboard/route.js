import { NextResponse } from 'next/server';
import { db } from '@/utils/dbConfig';
import { Budgets, Transactions } from '@/utils/schema';
import { eq, desc, getTableColumns, sql } from 'drizzle-orm';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const userEmail = url.searchParams.get('email');
    const page = parseInt(url.searchParams.get('page') || "1");
    const limit = parseInt(url.searchParams.get('limit') || "10");
    const offset = (page - 1) * limit;

    if (!userEmail) return NextResponse.json({ budgets: [], transactions: [], totalTransactions: 0, categoryAggregation: {} });

    // 1️⃣ Budgets with totals
    const budgetsRaw = await db
      .select({
        ...getTableColumns(Budgets),
        totalSpend: sql`COALESCE(SUM(${Transactions.amount}), 0)`.mapWith(Number),
        totalItem: sql`COUNT(${Transactions.id})`.mapWith(Number),
      })
      .from(Budgets)
      .leftJoin(Transactions, eq(Budgets.id, Transactions.budgetId))
      .where(eq(Budgets.createdBy, userEmail))
      .groupBy(Budgets.id)
      .orderBy(desc(Budgets.id));

    const budgets = budgetsRaw.map(r => ({ ...r, createdAt: r.createdAt?.toISOString() }));

    // 2️⃣ Total transactions count
    const totalCountRes = await db
      .select({ count: sql`COUNT(${Transactions.id})`.mapWith(Number) })
      .from(Budgets)
      .rightJoin(Transactions, eq(Budgets.id, Transactions.budgetId))
      .where(eq(Budgets.createdBy, userEmail));
    const totalTransactions = totalCountRes[0]?.count || 0;

    // 3️⃣ Transactions with pagination
    const transactionsRaw = await db
      .select({
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

    const transactions = transactionsRaw.map(r => ({ ...r, createdAt: r.createdAt?.toString() }));

    // 4️⃣ Category aggregation
    const categoryRaw = await db
      .select({
        category: Transactions.category,
        totalAmount: sql`COALESCE(SUM(${Transactions.amount}),0)`.mapWith(Number),
      })
      .from(Transactions)
      .leftJoin(Budgets, eq(Budgets.id, Transactions.budgetId))
      .where(eq(Budgets.createdBy, userEmail))
      .groupBy(Transactions.category);

    const categoryAggregation = {};
    categoryRaw.forEach(item => {
      categoryAggregation[item.category || 'Uncategorized'] = item.totalAmount;
    });

    return NextResponse.json({
      budgets,
      transactions,
      totalTransactions,
      page,
      limit,
      categoryAggregation,
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ budgets: [], transactions: [], totalTransactions: 0, categoryAggregation: {} });
  }
}
