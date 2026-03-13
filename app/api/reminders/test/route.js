import { NextResponse } from 'next/server';
import { sendTestEmail, sendRecurringTransactionReminder } from '@/utils/emailService';

// POST - Send test reminder email
export async function POST(req) {
  try {
    const { email, type = 'test' } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    let result;

    if (type === 'test') {
      // Send test email
      result = await sendTestEmail(email);
    } else if (type === 'reminder') {
      // Send sample reminder email
      const sampleTransaction = {
        name: 'Sample Recurring Transaction',
        amount: '1000',
        category: 'Test Category',
        recurring: 'monthly',
      };
      
      result = await sendRecurringTransactionReminder(
        email,
        sampleTransaction,
        new Date()
      );
    }

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Test email sent successfully',
        messageId: result.messageId,
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to send test email', details: result.error },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error sending test email:', error);
    return NextResponse.json(
      { error: 'Failed to send test email', details: error.message },
      { status: 500 }
    );
  }
}