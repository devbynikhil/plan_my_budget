const { test, expect } = require('@playwright/test')

test.describe('Authentication Flow', () => {
  test('should redirect unauthenticated users to sign in', async ({ page }) => {
    await page.goto('/dashboard')
    
    // Should be redirected to Clerk sign-in page
    await expect(page).toHaveURL(/sign-in/)
  })

  test('should allow authenticated users to access dashboard', async ({ page }) => {
    // Note: In a real test, you'd need to set up authentication
    // This is a placeholder for the authentication flow
    
    // Mock authentication or use test user credentials
    await page.goto('/sign-in')
    
    // Fill in sign-in form (adjust selectors based on Clerk's UI)
    await page.fill('[name="identifier"]', 'test@example.com')
    await page.fill('[name="password"]', 'testpassword')
    await page.click('button[type="submit"]')
    
    // Should redirect to dashboard after successful sign-in
    await expect(page).toHaveURL('/dashboard')
    await expect(page.locator('h1')).toContainText('Dashboard')
  })

  test('should display user information when authenticated', async ({ page }) => {
    // Assuming user is authenticated
    await page.goto('/dashboard')
    
    // Check if user button/menu is visible
    await expect(page.locator('[data-testid="user-button"]')).toBeVisible()
  })
})