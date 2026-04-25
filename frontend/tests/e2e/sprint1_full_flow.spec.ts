import { test, expect } from '@playwright/test';

test.describe('Sprint 1 Acceptance Criteria', () => {
  
  test('Full User Journey: Registration to Search (US-01 to US-10)', async ({ page }) => {
    // Capture browser console logs
    page.on('console', msg => console.log(`[Browser] ${msg.type()}: ${msg.text()}`));
    page.on('pageerror', err => console.log(`[Browser Error] ${err.message}`));

    // 1. Register a new candidate
    await page.goto('/register');
    await page.getByPlaceholder('Your full name').fill('Sprint One Tester');
    const uniqueId = Math.floor(Math.random() * 1000000);
    await page.getByPlaceholder('your@email.com').fill(`user_${uniqueId}@rishtafy-test.com`);
    await page.getByPlaceholder('Min. 8 characters').fill('password123');
    await page.getByPlaceholder('Re-enter password').fill('password123');
    await page.getByRole('button', { name: 'Create Account' }).click();

    // If registration fails, let's log the error message from the UI
    const errorMsg = page.locator('text=Registration failed');
    const specificError = page.locator('.flex.items-center.gap-2.p-3.rounded-lg.mb-5.text-sm'); // The error div in RegisterPage
    
    if (await specificError.isVisible()) {
        console.log('Registration Error detected in UI:', await specificError.innerText());
    }

    // EXPECTATION: Should redirect to Profile Edit page
    await expect(page).toHaveURL(/.*profile\/edit/); 
    
    // 2. Fill out Profile (US-05)
    await page.getByLabel('Age *').fill('25');
    await page.getByLabel('City *').selectOption('Karachi');
    await page.getByRole('button', { name: 'Save Changes' }).click();

    // EXPECTATION: Success message
    await expect(page.getByText('Saved!')).toBeVisible();

    // 3. Register a SECOND candidate so User B can find User A
    const secondUserEmail = `user_B_${uniqueId}@rishtafy-test.com`;
    await page.goto('/register');
    await page.getByPlaceholder('Your full name').fill('Second Searcher');
    await page.getByPlaceholder('your@email.com').fill(secondUserEmail);
    await page.getByPlaceholder('Min. 8 characters').fill('password123');
    await page.getByPlaceholder('Re-enter password').fill('password123');
    await page.getByRole('button', { name: 'Create Account' }).click();
    
    await expect(page).toHaveURL(/.*profile\/edit/);

    // 4. Go to Search (US-10)
    await page.goto('/search');
    
    // EXPECTATION: Should see at least one profile card (User A)
    await page.waitForTimeout(2000); // Wait for API fetch
    const count = await page.locator('.profile-card').count();
    expect(count).toBeGreaterThan(0);
  });
});
