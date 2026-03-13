import { db } from '@/utils/dbConfig';
import { Budgets, Transactions } from '@/utils/schema';
import { eq, desc, sql, and, gte } from 'drizzle-orm';

/**
 * Get comprehensive financial data for a user
 */
export const getUserFinancialData = async (userEmail) => {
  try {
    // Check if database is available (for build-time safety)
    if (!db) {
      throw new Error('Database connection not available');
    }

    // Get budgets with spending data
    const budgetsData = await db
      .select({
        id: Budgets.id,
        name: Budgets.name,
        amount: Budgets.amount,
        category: Budgets.category,
        icon: Budgets.icon,
        totalSpend: sql`COALESCE(SUM(${Transactions.amount}), 0)`.mapWith(Number),
        totalTransactions: sql`COUNT(${Transactions.id})`.mapWith(Number),
      })
      .from(Budgets)
      .leftJoin(Transactions, eq(Budgets.id, Transactions.budgetId))
      .where(eq(Budgets.createdBy, userEmail))
      .groupBy(Budgets.id, Budgets.name, Budgets.amount, Budgets.category, Budgets.icon);

    // Get recent transactions (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentTransactions = await db
      .select({
        id: Transactions.id,
        name: Transactions.name,
        amount: Transactions.amount,
        category: Transactions.category,
        recurring: Transactions.recurring,
        createdAt: Transactions.createdAt,
        budgetName: Budgets.name,
      })
      .from(Transactions)
      .innerJoin(Budgets, eq(Budgets.id, Transactions.budgetId))
      .where(
        and(
          eq(Budgets.createdBy, userEmail),
          gte(Transactions.createdAt, thirtyDaysAgo)
        )
      )
      .orderBy(desc(Transactions.createdAt))
      .limit(50);

    // Get spending by category
    const categorySpending = await db
      .select({
        category: Transactions.category,
        totalAmount: sql`COALESCE(SUM(${Transactions.amount}), 0)`.mapWith(Number),
        transactionCount: sql`COUNT(${Transactions.id})`.mapWith(Number),
      })
      .from(Transactions)
      .innerJoin(Budgets, eq(Budgets.id, Transactions.budgetId))
      .where(eq(Budgets.createdBy, userEmail))
      .groupBy(Transactions.category);

    // Get monthly spending trend (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlySpending = await db
      .select({
        month: sql`EXTRACT(YEAR FROM ${Transactions.createdAt}) || '-' || LPAD(EXTRACT(MONTH FROM ${Transactions.createdAt})::text, 2, '0')`,
        totalAmount: sql`COALESCE(SUM(${Transactions.amount}), 0)`.mapWith(Number),
        transactionCount: sql`COUNT(${Transactions.id})`.mapWith(Number),
      })
      .from(Transactions)
      .innerJoin(Budgets, eq(Budgets.id, Transactions.budgetId))
      .where(
        and(
          eq(Budgets.createdBy, userEmail),
          gte(Transactions.createdAt, sixMonthsAgo)
        )
      )
      .groupBy(sql`EXTRACT(YEAR FROM ${Transactions.createdAt}), EXTRACT(MONTH FROM ${Transactions.createdAt})`)
      .orderBy(sql`EXTRACT(YEAR FROM ${Transactions.createdAt}), EXTRACT(MONTH FROM ${Transactions.createdAt})`);

    // Calculate totals and insights
    const totalBudget = budgetsData.reduce((sum, budget) => sum + Number(budget.amount || 0), 0);
    const totalSpent = budgetsData.reduce((sum, budget) => sum + (budget.totalSpend || 0), 0);
    const totalTransactions = recentTransactions.length;
    const averageTransactionAmount = totalTransactions > 0 ? totalSpent / totalTransactions : 0;

    // Calculate budget utilization
    const budgetUtilization = budgetsData.map(budget => ({
      ...budget,
      amount: Number(budget.amount || 0),
      totalSpend: budget.totalSpend || 0,
      utilizationPercentage: Number(budget.amount || 0) > 0 ? ((budget.totalSpend || 0) / Number(budget.amount || 0)) * 100 : 0,
      remainingAmount: Number(budget.amount || 0) - (budget.totalSpend || 0),
    }));

    return {
      summary: {
        totalBudget,
        totalSpent,
        remainingBudget: totalBudget - totalSpent,
        totalTransactions,
        averageTransactionAmount,
        budgetUtilizationPercentage: totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0,
      },
      budgets: budgetUtilization,
      recentTransactions: recentTransactions.map(t => ({
        ...t,
        createdAt: t.createdAt?.toISOString() || new Date().toISOString(),
        amount: Number(t.amount || 0),
      })),
      categorySpending: categorySpending.map(c => ({
        ...c,
        category: c.category || 'Uncategorized',
        totalAmount: Number(c.totalAmount || 0),
        transactionCount: Number(c.transactionCount || 0),
      })),
      monthlySpending: monthlySpending.map(m => ({
        ...m,
        month: m.month || 'Unknown',
        totalAmount: Number(m.totalAmount || 0),
        transactionCount: Number(m.transactionCount || 0),
      })),
      insights: generateBasicInsights(budgetUtilization, categorySpending || [], totalBudget, totalSpent),
    };

  } catch (error) {
    console.error('Error fetching financial data:', error);
    throw new Error('Failed to fetch financial data');
  }
};

/**
 * Generate basic financial insights
 */
const generateBasicInsights = (budgets, categorySpending, totalBudget, totalSpent) => {
  const insights = [];

  // Budget overspending check
  const overspentBudgets = budgets.filter(b => b.utilizationPercentage > 100);
  if (overspentBudgets.length > 0) {
    insights.push({
      type: 'warning',
      title: 'Budget Overspending',
      message: `You've exceeded ${overspentBudgets.length} budget(s): ${overspentBudgets.map(b => b.name).join(', ')}`,
    });
  }

  // High spending categories
  const sortedCategories = categorySpending.sort((a, b) => b.totalAmount - a.totalAmount);
  if (sortedCategories.length > 0) {
    insights.push({
      type: 'info',
      title: 'Top Spending Category',
      message: `Your highest spending category is "${sortedCategories[0].category || 'Uncategorized'}" with ₹${sortedCategories[0].totalAmount}`,
    });
  }

  // Budget utilization
  const utilizationPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
  if (utilizationPercentage > 90) {
    insights.push({
      type: 'warning',
      title: 'High Budget Utilization',
      message: `You've used ${utilizationPercentage.toFixed(1)}% of your total budget`,
    });
  } else if (utilizationPercentage < 50) {
    insights.push({
      type: 'success',
      title: 'Good Budget Management',
      message: `You're doing well! Only ${utilizationPercentage.toFixed(1)}% of your budget used`,
    });
  }

  return insights;
};