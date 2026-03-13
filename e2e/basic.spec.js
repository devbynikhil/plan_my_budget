const { test, expect } = require('@playwright/test')

test.describe('Basic App Functionality', () => {
  test('should load the homepage', async ({ page }) => {
    await page.goto('/')
    
    // Check if the page loads without errors
    await expect(page).toHaveTitle(/Expenses Tracker/)
    
    // Check for basic elements that should be present
    await expect(page.locator('body')).toBeVisible()
  })

  test('should handle 404 pages gracefully', async ({ page }) => {
    await page.goto('/non-existent-page')
    
    // Should show a 404 page or redirect appropriately
    // This test ensures the app doesn't crash on invalid routes
    await expect(page.locator('body')).toBeVisible()
  })

  test('should load without JavaScript errors', async ({ page }) => {
    const errors = []
    page.on('pageerror', error => errors.push(error))
    
    await page.goto('/')
    
    // Wait a bit for any async operations
    await page.waitForTimeout(2000)
    
    // Should not have any JavaScript errors
    expect(errors).toHaveLength(0)
  })
})