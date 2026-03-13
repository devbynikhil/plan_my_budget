const { test, expect } = require('@playwright/test')

test.describe('Dashboard Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Setup authentication - adjust based on your auth setup
    await page.goto('/dashboard')
  })

  test('should display dashboard overview', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Dashboard')
    
    // Check for key dashboard elements
    await expect(page.locator('[data-testid="total-budget"]')).toBeVisible()
    await expect(page.locator('[data-testid="total-expenses"]')).toBeVisible()
    await expect(page.locator('[data-testid="remaining-budget"]')).toBeVisible()
  })

  test('should navigate between different sections', async ({ page }) => {
    // Test navigation to budgets
    await page.click('text=Budgets')
    await expect(page).toHaveURL('/dashboard/budgets')
    await expect(page.locator('h1')).toContainText('Budgets')

    // Test navigation to expenses
    await page.click('text=Expenses')
    await expect(page).toHaveURL('/dashboard/expenses')
    await expect(page.locator('h1')).toContainText('Expenses')

    // Test navigation to AI Advisor
    await page.click('text=AI Advisor')
    await expect(page).toHaveURL('/dashboard/ai-advisor')
    await expect(page.locator('h1')).toContainText('AI Financial Advisor')
  })

  test('should display recent transactions', async ({ page }) => {
    await expect(page.locator('[data-testid="recent-transactions"]')).toBeVisible()
    
    // Check if transactions are loaded
    const transactionItems = page.locator('[data-testid="transaction-item"]')
    await expect(transactionItems.first()).toBeVisible()
  })

  test('should show budget progress bars', async ({ page }) => {
    await expect(page.locator('[data-testid="budget-progress"]')).toBeVisible()
    
    // Check if progress bars are rendered
    const progressBars = page.locator('.progress-bar')
    await expect(progressBars.first()).toBeVisible()
  })
})