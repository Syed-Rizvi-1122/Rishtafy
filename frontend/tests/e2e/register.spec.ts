import { test, expect } from '@playwright/test';

test.describe('Register Page (PRD US-01 & US-02)', () => {
  test('verifies the Candidate and Guardian role selector', async ({ page }) => {
    // We will navigate to /register when the dev server is running
    await page.goto('/register');
    
    // Verify the selector labels exist
    await expect(page.getByText('I am registering as:')).toBeVisible();
    
    // Verify the buttons for roles
    const candidateBtn = page.getByRole('button', { name: /Candidate/i });
    const guardianBtn = page.getByRole('button', { name: /Guardian/i });
    
    await expect(candidateBtn).toBeVisible();
    await expect(guardianBtn).toBeVisible();
  });
});
