"use client";
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { useUser } from '@clerk/nextjs';
import { Mail, Clock, Settings, TestTube } from 'lucide-react';

function RemindersPage() {
  const { user } = useUser();
  const [testEmail, setTestEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingReminders, setCheckingReminders] = useState(false);

  // Check if user is admin (multiple methods supported)
  const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',') || ['mailalantest@gmail.com'];
  
  const isAdmin = user?.primaryEmailAddress?.emailAddress && 
                  adminEmails.includes(user.primaryEmailAddress.emailAddress);

  // Show access denied for non-admin users
  if (!isAdmin) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Access Denied</CardTitle>
            <CardDescription>
              You don't have permission to access this page. This area is restricted to administrators only.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              If you believe you should have access to this page, please contact your system administrator.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const sendTestEmail = async (type = 'test') => {
    if (!testEmail) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/reminders/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: testEmail,
          type: type,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: `${type === 'test' ? 'Test' : 'Sample reminder'} email sent successfully!`,
        });
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to send email",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error sending test email:', error);
      toast({
        title: "Error",
        description: "Failed to send test email",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const checkReminders = async () => {
    try {
      setCheckingReminders(true);
      const response = await fetch('/api/reminders/check');
      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Reminders Checked",
          description: `Processed ${data.results?.length || 0} reminders out of ${data.totalDue || 0} due transactions`,
        });
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to check reminders",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error checking reminders:', error);
      toast({
        title: "Error",
        description: "Failed to check reminders",
        variant: "destructive",
      });
    } finally {
      setCheckingReminders(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Recurring Transaction Reminders</h1>
        <p className="text-gray-600 mt-2">
          Manage and test your recurring transaction reminder system
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Email Configuration Test */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TestTube className="h-5 w-5" />
              Test Email Configuration
            </CardTitle>
            <CardDescription>
              Send a test email to verify your email configuration is working
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Test Email Address</label>
              <Input
                type="email"
                placeholder={user?.primaryEmailAddress?.emailAddress || "Enter email address"}
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => sendTestEmail('test')}
                disabled={loading}
                className="flex-1"
              >
                <Mail className="h-4 w-4 mr-2" />
                {loading ? 'Sending...' : 'Send Test Email'}
              </Button>
              <Button
                onClick={() => sendTestEmail('reminder')}
                disabled={loading}
                variant="outline"
                className="flex-1"
              >
                <Clock className="h-4 w-4 mr-2" />
                {loading ? 'Sending...' : 'Send Sample Reminder'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Manual Reminder Check */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Manual Reminder Check
            </CardTitle>
            <CardDescription>
              Manually trigger the reminder system to check for due transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={checkReminders}
              disabled={checkingReminders}
              className="w-full"
            >
              <Settings className="h-4 w-4 mr-2" />
              {checkingReminders ? 'Checking...' : 'Check Due Reminders Now'}
            </Button>
            <p className="text-sm text-gray-500 mt-2">
              This will check all recurring transactions and send reminders for those due today
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Setup Instructions */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Setup Instructions</CardTitle>
          <CardDescription>
            Follow these steps to set up automated recurring transaction reminders
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">1</div>
              <div>
                <h4 className="font-medium">Configure Email Settings</h4>
                <p className="text-sm text-gray-600">
                  Add these environment variables to your .env.local file:
                </p>
                <div className="bg-gray-100 p-3 rounded mt-2 text-sm font-mono">
                  SMTP_HOST=smtp.gmail.com<br/>
                  SMTP_PORT=587<br/>
                  SMTP_USER=your-email@gmail.com<br/>
                  SMTP_PASS=your-app-password<br/>
                  SMTP_FROM=your-email@gmail.com
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">2</div>
              <div>
                <h4 className="font-medium">Set Up Cron Job</h4>
                <p className="text-sm text-gray-600">
                  Configure a daily cron job to call: <code className="bg-gray-100 px-1 rounded">/api/cron/reminders</code>
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  You can use Vercel Cron, GitHub Actions, or any external cron service
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">3</div>
              <div>
                <h4 className="font-medium">Test the System</h4>
                <p className="text-sm text-gray-600">
                  Use the test buttons above to verify emails are working, then create some recurring transactions to test
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default RemindersPage;