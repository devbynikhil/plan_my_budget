import { NextResponse } from 'next/server';
import { db } from '@/utils/dbConfig';
import { Transactions } from '@/utils/schema';
import { eq } from 'drizzle-orm';

// DELETE - Delete a transaction
export async function DELETE(req, { params }) {
  try {
    const { id } = params;

    const result = await db.delete(Transactions)
      .where(eq(Transactions.id, id))
      .returning();

    if (result.length === 0) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return NextResponse.json({ error: 'Failed to delete transaction' }, { status: 500 });
  }
}