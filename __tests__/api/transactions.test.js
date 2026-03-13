// Set up environment variables before importing modules
process.env.NEXT_PUBLIC_DATABASE_URL = 'postgresql://test:test@localhost:5432/test'

import { GET, POST } from '../../app/api/transactions/route'

// Mock the entire dbConfig module
jest.mock('../../utils/dbConfig', () => ({
  db: {
    select: jest.fn(),
    insert: jest.fn()
  }
}))

jest.mock('../../utils/recurringUtils', () => ({
  calculateNextDueDate: jest.fn(() => new Date('2024-02-15'))
}))

// Mock NextResponse
jest.mock('next/server', () => ({
  NextResponse: {
    json: (data, options = {}) => ({
      json: async () => data,
      status: options.status || 200
    })
  }
}))

describe('/api/transactions', () => {
  const { db } = require('../../utils/dbConfig')
  
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/transactions', () => {
    it('should return transactions with pagination', async () => {
      const mockTransactions = [
        { 
          id: 1, 
          name: 'Coffee', 
          amount: 5.50, 
          createdAt: new Date('2024-01-15'),
          budgetId: 1,
          category: 'Food'
        }
      ]

      // Mock the count query
      db.select.mockReturnValueOnce({
        from: jest.fn().mockReturnValue({
          rightJoin: jest.fn().mockReturnValue({
            where: jest.fn().mockResolvedValue([{ count: 1 }])
          })
        })
      })

      // Mock the transactions query
      db.select.mockReturnValueOnce({
        from: jest.fn().mockReturnValue({
          rightJoin: jest.fn().mockReturnValue({
            where: jest.fn().mockReturnValue({
              orderBy: jest.fn().mockReturnValue({
                limit: jest.fn().mockReturnValue({
                  offset: jest.fn().mockResolvedValue(mockTransactions)
                })
              })
            })
          })
        })
      })

      const request = new Request('http://localhost:3000/api/transactions?email=test@example.com&page=1&limit=10')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.transactions).toBeDefined()
      expect(data.totalTransactions).toBe(1)
      expect(data.page).toBe(1)
    })

    it('should return 400 for missing email', async () => {
      const request = new Request('http://localhost:3000/api/transactions')
      const response = await GET(request)

      expect(response.status).toBe(400)
    })

    it('should handle database errors', async () => {
      db.select.mockImplementation(() => {
        throw new Error('Database connection failed')
      })

      const request = new Request('http://localhost:3000/api/transactions?email=test@example.com')
      const response = await GET(request)

      expect(response.status).toBe(500)
    })
  })

  describe('POST /api/transactions', () => {
    it('should create new transaction', async () => {
      const mockTransaction = {
        name: 'New Transaction',
        amount: 25.00,
        budgetId: 1,
        category: 'Food'
      }

      const mockResult = [{ id: 3, ...mockTransaction, createdAt: new Date() }]

      db.insert.mockReturnValue({
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue(mockResult)
        })
      })

      const request = new Request('http://localhost:3000/api/transactions', {
        method: 'POST',
        body: JSON.stringify(mockTransaction)
      })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.transaction.name).toBe(mockTransaction.name)
    })

    it('should validate required fields', async () => {
      const invalidTransaction = {
        name: '', // Empty name should fail validation
        amount: 25.00
        // Missing budgetId
      }

      const request = new Request('http://localhost:3000/api/transactions', {
        method: 'POST',
        body: JSON.stringify(invalidTransaction)
      })
      const response = await POST(request)

      expect(response.status).toBe(400)
    })

    it('should handle recurring transactions', async () => {
      const recurringTransaction = {
        name: 'Monthly Subscription',
        amount: 15.99,
        budgetId: 1,
        category: 'Entertainment',
        recurring: 'monthly'
      }

      const mockResult = [{ 
        id: 4, 
        ...recurringTransaction, 
        nextDueDate: new Date('2024-02-15'),
        createdAt: new Date() 
      }]

      db.insert.mockReturnValue({
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue(mockResult)
        })
      })

      const request = new Request('http://localhost:3000/api/transactions', {
        method: 'POST',
        body: JSON.stringify(recurringTransaction)
      })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.transaction.recurring).toBe('monthly')
    })
  })
})