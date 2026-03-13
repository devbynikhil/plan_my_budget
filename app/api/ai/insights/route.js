import { NextResponse } from 'next/server';
import { getUserFinancialData } from '@/utils/financialDataService';
import { generateFinancialInsights, generateQuickTips } from '@/utils/aiService';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req) {
  try {
    // Check if we're in build time - if so, return early
    if (process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL && !process.env.NEXT_PUBLIC_DATABASE_URL) {
      return NextResponse.json({ 
        error: 'Service unavailable during build time',
        message: 'This endpoint is not available during static generation'
      }, { status: 503 });
    }

    const url = new URL(req.url);
    const userEmail = url.searchParams.get('email');

    if (!userEmail) {
      return NextResponse.json({ error: 'User email is required' }, { status: 400 });
    }

    // Get user's financial data
    let financialData;
    try {
      financialData = await getUserFinancialData(userEmail);
    } catch (dataError) {
      console.error('Error fetching financial data:', dataError);
      // Return default data structure if no data exists
      financialData = {
        summary: {
          totalBudget: 0,
          totalSpent: 0,
          remainingBudget: 0,
          totalTransactions: 0,
          averageTransactionAmount: 0,
          budgetUtilizationPercentage: 0,
        },
        budgets: [],
        recentTransactions: [],
        categorySpending: [],
        monthlySpending: [],
        insights: [{
          type: 'info',
          title: 'Getting Started',
          message: 'Create your first budget to start tracking your expenses and get personalized insights.',
        }],
      };
    }

    // Generate comprehensive insights
    const aiInsights = await generateFinancialInsights(financialData);

    // Generate quick tips
    const quickTips = await generateQuickTips(financialData);

    return NextResponse.json({
      success: true,
      financialData: {
        summary: financialData.summary,
        budgets: financialData.budgets,
        categorySpending: financialData.categorySpending,
        insights: financialData.insights,
      },
      aiInsights: aiInsights.response,
      quickTips: quickTips.tips || [
        "Start by creating your first budget to track expenses",
        "Set realistic spending limits for different categories",
        "Review your spending weekly to stay on track"
      ],
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Error generating insights:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate insights',
        details: error.message 
      },
      { status: 500 }
    );
  }
}