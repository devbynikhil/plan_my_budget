import { generateFinancialInsights, generateQuickTips } from '../../utils/aiService'

// Mock environment variables for testing
process.env.AI_PROVIDER = 'mock'

describe('AI Service', () => {
  beforeEach(() => {
    // Ensure we're using mock provider for tests
    process.env.AI_PROVIDER = 'mock'
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('generateFinancialInsights', () => {
    const mockFinancialData = {
      budgets: [
        { 
          name: 'Food', 
          amount: 500, 
          totalSpend: 450,
          category: 'Food',
          utilizationPercentage: 90
        }
      ],
      recentTransactions: [
        { 
          name: 'Grocery Store', 
          amount: 85, 
          category: 'Food',
          createdAt: new Date().toISOString()
        }
      ],
      summary: {
        totalBudget: 1000,
        totalSpent: 450,
        remainingBudget: 550,
        budgetUtilizationPercentage: 45,
        totalTransactions: 1,
        averageTransactionAmount: 85
      },
      categorySpending: [
        { category: 'Food', totalAmount: 450, transactionCount: 1 }
      ],
      monthlySpending: [
        { month: 'January 2024', totalAmount: 450 }
      ]
    }

    it('should generate financial insights successfully', async () => {
      const result = await generateFinancialInsights(mockFinancialData)

      expect(result.success).toBe(true)
      expect(result.response).toContain('spending patterns')
      expect(result.provider).toBe('mock')
    })

    it('should handle API errors gracefully with fallback', async () => {
      // Mock provider should always work, so test with a different provider
      process.env.AI_PROVIDER = 'openai'
      process.env.OPENAI_API_KEY = 'invalid-key'

      const result = await generateFinancialInsights(mockFinancialData)

      // Should fallback to mock and still succeed
      expect(result.success).toBe(true)
      expect(result.provider).toContain('fallback-mock')
    })

    it('should handle new users with no data', async () => {
      const emptyData = {
        budgets: [],
        recentTransactions: [],
        summary: { totalBudget: 0, totalSpent: 0, remainingBudget: 0, budgetUtilizationPercentage: 0, totalTransactions: 0, averageTransactionAmount: 0 },
        categorySpending: [],
        monthlySpending: []
      }

      const result = await generateFinancialInsights(emptyData)

      expect(result.success).toBe(true)
      expect(result.response).toContain('spending patterns')
      expect(result.provider).toBe('mock')
    })
  })

  describe('generateQuickTips', () => {
    const mockFinancialData = {
      summary: {
        budgetUtilizationPercentage: 75,
        remainingBudget: 250
      },
      categorySpending: [
        { category: 'Food', totalAmount: 450 },
        { category: 'Entertainment', totalAmount: 200 }
      ],
      budgets: [
        { utilizationPercentage: 90 },
        { utilizationPercentage: 120 }
      ]
    }

    it('should generate quick tips successfully', async () => {
      const result = await generateQuickTips(mockFinancialData)

      expect(result.success).toBe(true)
      expect(result.tips).toBeDefined()
      expect(Array.isArray(result.tips)).toBe(true)
      expect(result.tips.length).toBeGreaterThan(0)
    })

    it('should provide fallback tips on error', async () => {
      // Test with invalid provider to trigger fallback
      process.env.AI_PROVIDER = 'openai'
      process.env.OPENAI_API_KEY = 'invalid-key'

      const result = await generateQuickTips(mockFinancialData)

      expect(result.success).toBe(true) // Should fallback to default tips
      expect(result.tips).toBeDefined()
      expect(Array.isArray(result.tips)).toBe(true)
      expect(result.tips.length).toBeGreaterThan(0)
    })
  })
})