const { test, expect } = require('@playwright/test')

test.describe('Transaction Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard/expenses')
  })

  test('should create a new transaction', async ({ page }) => {
    // Click add transaction button
    await page.click('[data-testid="add-transaction-btn"]')
    
    // Fill transaction form
    await page.fill('[name="name"]', 'Test Coffee Purchase')
    await page.fill('[name="amount"]', '4.50')
    await page.selectOption('[name="category"]', 'Food')
    
    // Submit form
    await page.click('button[type="submit"]')
    
    // Verify transaction was created
    await expect(page.locator('text=Test Coffee Purchase')).toBeVisible()
    await expect(page.locator('text=$4.50')).toBeVisible()
  })

  test('should edit an existing transaction', async ({ page }) => {
    // Click on first transaction edit button
    await page.click('[data-testid="edit-transaction-btn"]')
    
    // Update transaction details
    await page.fill('[name="name"]', 'Updated Transaction Name')
    await page.fill('[name="amount"]', '15.99')
    
    // Save changes
    await page.click('button[type="submit"]')
    
    // Verify changes
    await expect(page.locator('text=Updated Transaction Name')).toBeVisible()
    await expect(page.locator('text=$15.99')).toBeVisible()
  })

  test('should delete a transaction', async ({ page }) => {
    // Get initial transaction count
    const initialCount = await page.locator('[data-testid="transaction-item"]').count()
    
    // Click delete button on first transaction
    await page.click('[data-testid="delete-transaction-btn"]')
    
    // Confirm deletion in dialog
    await page.click('text=Delete')
    
    // Verify transaction was removed
    const newCount = await page.locator('[data-testid="transaction-item"]').count()
    expect(newCount).toBe(initialCount - 1)
  })

  test('should filter transactions by category', async ({ page }) => {
    // Select food category filter
    await page.selectOption('[data-testid="category-filter"]', 'Food')
    
    // Verify only food transactions are shown
    const transactions = page.locator('[data-testid="transaction-item"]')
    const count = await transactions.count()
    
    for (let i = 0; i < count; i++) {
      await expect(transactions.nth(i).locator('[data-testid="transaction-category"]')).toContainText('Food')
    }
  })

  test('should validate transaction form', async ({ page }) => {
    await page.click('[data-testid="add-transaction-btn"]')
    
    // Try to submit empty form
    await page.click('button[type="submit"]')
    
    // Check for validation errors
    await expect(page.locator('text=Name is required')).toBeVisible()
    await expect(page.locator('text=Amount is required')).toBeVisible()
  })
})