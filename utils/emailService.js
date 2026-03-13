import nodemailer from 'nodemailer';

// Create transporter (you'll need to configure this with your email provider)
const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: process.env.SMTP_PORT || 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER, // your email
            pass: process.env.SMTP_PASS, // your email password or app password
        },
    });
};

export const sendRecurringTransactionReminder = async (userEmail, transaction, nextDueDate) => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: process.env.SMTP_FROM || process.env.SMTP_USER,
            to: userEmail,
            subject: `Reminder: ${transaction.name} - Recurring Transaction Due`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Recurring Transaction Reminder</h2>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #495057; margin-top: 0;">Transaction Details</h3>
            <p><strong>Name:</strong> ${transaction.name}</p>
            <p><strong>Amount:</strong> ₹${transaction.amount}</p>
            <p><strong>Category:</strong> ${transaction.category || 'Uncategorized'}</p>
            <p><strong>Frequency:</strong> ${transaction.recurring}</p>
            <p><strong>Next Due Date:</strong> ${nextDueDate.toLocaleDateString()}</p>
          </div>

          <div style="background-color: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #1976d2;">
              <strong>💡 Reminder:</strong> This is an automated reminder for your recurring transaction. 
              Don't forget to add this transaction to your budget tracker!
            </p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" 
               style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Go to Dashboard
            </a>
          </div>

          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #6c757d; font-size: 12px; text-align: center;">
            This is an automated email from your Budget Tracker. If you no longer want to receive these reminders, 
            you can update your transaction settings in the dashboard.
          </p>
        </div>
      `,
        };

        const result = await transporter.sendMail(mailOptions);
        console.log('Reminder email sent:', result.messageId);
        return { success: true, messageId: result.messageId };
    } catch (error) {
        console.error('Error sending reminder email:', error);
        return { success: false, error: error.message };
    }
};

export const sendTestEmail = async (userEmail) => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: process.env.SMTP_FROM || process.env.SMTP_USER,
            to: userEmail,
            subject: 'Test Email - Budget Tracker',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Email Configuration Test</h2>
          <p>This is a test email to verify your email configuration is working correctly.</p>
          <p>If you received this email, your recurring transaction reminders will work properly!</p>
        </div>
      `,
        };

        const result = await transporter.sendMail(mailOptions);
        return { success: true, messageId: result.messageId };
    } catch (error) {
        console.error('Error sending test email:', error);
        return { success: false, error: error.message };
    }
};