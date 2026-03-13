import { sendRecurringTransactionReminder, sendTestEmail } from '../../utils/emailService'
import nodemailer from 'nodemailer'

// Mock nodemailer
jest.mock('nodemailer')

describe('Email Service', () => {
  let mockTransporter

  beforeEach(() => {
    mockTransporter = {
      sendMail: jest.fn().mockResolvedValue({ messageId: 'test-message-id' })
    }
    nodemailer.createTransport.mockReturnValue(mockTransporter)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('sendRecurringTransactionReminder', () => {
    const mockTransaction = {
      id: 1,
      name: 'Netflix Subscription',
      amount: 15.99,
      category: 'Entertainment',
      recurring: 'Monthly'
    }
    const mockDueDate = new Date('2024-01-15')

    it('should send reminder email successfully', async () => {
      const result = await sendRecurringTransactionReminder('test@example.com', mockTransaction, mockDueDate)

      expect(result.success).toBe(true)
      expect(result.messageId).toBe('test-message-id')
      expect(mockTransporter.sendMail).toHaveBeenCalledWith({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: 'test@example.com',
        subject: 'Reminder: Netflix Subscription - Recurring Transaction Due',
        html: expect.stringContaining('Netflix Subscription')
      })
    })

    it('should handle email sending errors', async () => {
      const error = new Error('SMTP connection failed')
      mockTransporter.sendMail.mockRejectedValue(error)

      const result = await sendRecurringTransactionReminder('test@example.com', mockTransaction, mockDueDate)

      expect(result.success).toBe(false)
      expect(result.error).toBe('SMTP connection failed')
    })

    it('should format email content correctly', async () => {
      await sendRecurringTransactionReminder('test@example.com', mockTransaction, mockDueDate)

      const emailCall = mockTransporter.sendMail.mock.calls[0][0]
      expect(emailCall.html).toContain('Netflix Subscription')
      expect(emailCall.html).toContain('₹15.99')
      expect(emailCall.html).toContain('Entertainment')
    })
  })

  describe('sendTestEmail', () => {
    it('should send test email successfully', async () => {
      const result = await sendTestEmail('test@example.com')

      expect(result.success).toBe(true)
      expect(result.messageId).toBe('test-message-id')
      expect(mockTransporter.sendMail).toHaveBeenCalledWith({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: 'test@example.com',
        subject: 'Test Email - Budget Tracker',
        html: expect.stringContaining('Email Configuration Test')
      })
    })
  })
})