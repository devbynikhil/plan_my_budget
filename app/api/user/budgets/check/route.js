import { NextResponse } from 'next/server';
import { db } from '@/utils/dbConfig';
import { Budgets } from '@/utils/schema';
import { eq } from 'drizzle-orm';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

// GET - Check if user has any budgets
export async function GET(req) {
  try {
    const url = new URL(req.url);
    const userEmail = url.searchParams.get('email');

    if (!userEmail) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const result = await db.select()
      .from(Budgets)
      .where(eq(Budgets.createdBy, userEmail));

    return NextResponse.json({ 
      hasBudgets: result.length > 0,
      budgetCount: result.length 
    });
  } catch (error) {
    console.error('Error checking user budgets:', error);
    return NextResponse.json({ error: 'Failed to check budgets' }, { status: 500 });
  }
}