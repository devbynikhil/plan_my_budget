// Simple working test examples to demonstrate the testing setup

describe('Working Test Examples', () => {
  describe('Basic JavaScript functionality', () => {
    it('should perform basic arithmetic', () => {
      expect(2 + 2).toBe(4)
      expect(10 - 5).toBe(5)
      expect(3 * 4).toBe(12)
    })

    it('should handle arrays', () => {
      const arr = [1, 2, 3]
      expect(arr).toHaveLength(3)
      expect(arr).toContain(2)
    })

    it('should handle objects', () => {
      const obj = { name: 'Test', value: 42 }
      expect(obj).toHaveProperty('name', 'Test')
      expect(obj.value).toBe(42)
    })
  })

  describe('Async functionality', () => {
    it('should handle promises', async () => {
      const promise = Promise.resolve('success')
      const result = await promise
      expect(result).toBe('success')
    })

    it('should handle async functions', async () => {
      const asyncFunction = async () => {
        return new Promise(resolve => {
          setTimeout(() => resolve('async result'), 10)
        })
      }

      const result = await asyncFunction()
      expect(result).toBe('async result')
    })
  })

  describe('Environment setup', () => {
    it('should have mocked environment variables', () => {
      expect(process.env.DATABASE_URL).toBeDefined()
      expect(process.env.OPENAI_API_KEY).toBeDefined()
      expect(process.env.EMAIL_USER).toBeDefined()
    })

    it('should have global mocks available', () => {
      expect(global.fetch).toBeDefined()
      expect(global.Request).toBeDefined()
      expect(global.Response).toBeDefined()
    })
  })
})