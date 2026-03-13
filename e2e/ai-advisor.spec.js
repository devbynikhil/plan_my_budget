const { test, expect } = require('@playwright/test')

test.describe('AI Advisor Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard/ai-advisor')
  })

  test('should display AI insights', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('AI Financial Advisor')
    
    // Wait for insights to load
    await expect(page.locator('[data-testid="ai-insights"]')).toBeVisible()
    await expect(page.locator('[data-testid="financial-summary"]')).toBeVisible()
  })

  test('should allow chat interaction', async ({ page }) => {
    // Type a message in chat input
    await page.fill('[data-testid="chat-input"]', 'How can I reduce my spending?')
    
    // Send message
    await page.click('[data-testid="send-message-btn"]')
    
    // Verify message appears in chat
    await expect(page.locator('text=How can I reduce my spending?')).toBeVisible()
    
    // Wait for AI response
    await expect(page.locator('[data-testid="ai-response"]')).toBeVisible({ timeout: 10000 })
  })

  test('should display spending recommendations', async ({ page }) => {
    await expect(page.locator('[data-testid="recommendations"]')).toBeVisible()
    
    // Check if recommendations are populated
    const recommendations = page.locator('[data-testid="recommendation-item"]')
    await expect(recommendations.first()).toBeVisible()
  })

  test('should show financial trends', async ({ page }) => {
    await expect(page.locator('[data-testid="financial-trends"]')).toBeVisible()
    
    // Check for chart elements
    await expect(page.locator('.recharts-wrapper')).toBeVisible()
  })

  test('should handle empty chat input', async ({ page }) => {
    // Try to send empty message
    await page.click('[data-testid="send-message-btn"]')
    
    // Should not send empty message
    const messages = page.locator('[data-testid="chat-message"]')
    const count = await messages.count()
    expect(count).toBe(0)
  })

  test('should display loading state during AI processing', async ({ page }) => {
    await page.fill('[data-testid="chat-input"]', 'Test message')
    await page.click('[data-testid="send-message-btn"]')
    
    // Check for loading indicator
    await expect(page.locator('[data-testid="ai-loading"]')).toBeVisible()
  })
})