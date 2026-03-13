// Test utility functions that don't depend on external services

describe('Financial Calculations', () => {
  describe('Budget calculations', () => {
    it('should calculate budget utilization percentage', () => {
      const calculateUtilization = (spent, budget) => {
        if (budget === 0) return 0
        return (spent / budget) * 100
      }

      expect(calculateUtilization(750, 1000)).toBe(75)
      expect(calculateUtilization(1200, 1000)).toBe(120)
      expect(calculateUtilization(0, 1000)).toBe(0)
      expect(calculateUtilization(500, 0)).toBe(0)
    })

    it('should calculate remaining budget', () => {
      const calculateRemaining = (budget, spent) => {
        return Math.max(0, budget - spent)
      }

      expect(calculateRemaining(1000, 750)).toBe(250)
      expect(calculateRemaining(1000, 1200)).toBe(0)
      expect(calculateRemaining(1000, 0)).toBe(1000)
    })
  })

  describe('Date calculations', () => {
    it('should calculate days until due date', () => {
      const calculateDaysUntil = (dueDate) => {
        const today = new Date('2024-01-15')
        const due = new Date(dueDate)
        const diffTime = due - today
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      }

      expect(calculateDaysUntil('2024-01-20')).toBe(5)
      expect(calculateDaysUntil('2024-01-15')).toBe(0)
      expect(calculateDaysUntil('2024-01-10')).toBe(-5)
    })

    it('should format currency', () => {
      const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: 'INR'
        }).format(amount)
      }

      expect(formatCurrency(1000)).toBe('₹1,000.00')
      expect(formatCurrency(1234.56)).toBe('₹1,234.56')
      expect(formatCurrency(0)).toBe('₹0.00')
    })
  })

  describe('Data validation', () => {
    it('should validate transaction data', () => {
      const validateTransaction = (transaction) => {
        const errors = []
        
        if (!transaction.name || transaction.name.trim() === '') {
          errors.push('Name is required')
        }
        
        if (!transaction.amount || transaction.amount <= 0) {
          errors.push('Amount must be greater than 0')
        }
        
        if (!transaction.budgetId) {
          errors.push('Budget ID is required')
        }
        
        return {
          isValid: errors.length === 0,
          errors
        }
      }

      // Valid transaction
      const validTransaction = {
        name: 'Coffee',
        amount: 5.50,
        budgetId: 1
      }
      expect(validateTransaction(validTransaction).isValid).toBe(true)

      // Invalid transactions
      const invalidTransaction1 = { name: '', amount: 5.50, budgetId: 1 }
      expect(validateTransaction(invalidTransaction1).isValid).toBe(false)
      expect(validateTransaction(invalidTransaction1).errors).toContain('Name is required')

      const invalidTransaction2 = { name: 'Coffee', amount: 0, budgetId: 1 }
      expect(validateTransaction(invalidTransaction2).isValid).toBe(false)
      expect(validateTransaction(invalidTransaction2).errors).toContain('Amount must be greater than 0')
    })
  })

  describe('Array operations', () => {
    it('should group transactions by category', () => {
      const transactions = [
        { name: 'Coffee', amount: 5.50, category: 'Food' },
        { name: 'Lunch', amount: 12.99, category: 'Food' },
        { name: 'Movie', amount: 15.00, category: 'Entertainment' },
        { name: 'Gas', amount: 40.00, category: 'Transportation' }
      ]

      const groupByCategory = (transactions) => {
        return transactions.reduce((acc, transaction) => {
          const category = transaction.category || 'Uncategorized'
          if (!acc[category]) {
            acc[category] = []
          }
          acc[category].push(transaction)
          return acc
        }, {})
      }

      const grouped = groupByCategory(transactions)
      
      expect(grouped.Food).toHaveLength(2)
      expect(grouped.Entertainment).toHaveLength(1)
      expect(grouped.Transportation).toHaveLength(1)
      expect(grouped.Food[0].name).toBe('Coffee')
    })

    it('should calculate category totals', () => {
      const transactions = [
        { amount: 5.50, category: 'Food' },
        { amount: 12.99, category: 'Food' },
        { amount: 15.00, category: 'Entertainment' }
      ]

      const calculateCategoryTotals = (transactions) => {
        return transactions.reduce((acc, transaction) => {
          const category = transaction.category || 'Uncategorized'
          acc[category] = (acc[category] || 0) + transaction.amount
          return acc
        }, {})
      }

      const totals = calculateCategoryTotals(transactions)
      
      expect(totals.Food).toBeCloseTo(18.49)
      expect(totals.Entertainment).toBe(15.00)
    })
  })
})