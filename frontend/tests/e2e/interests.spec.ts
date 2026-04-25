import { test, expect } from '@playwright/test';

test.describe('Interest Request Flow (Sprint 2)', () => {
  const uniqueId = Math.floor(Math.random() * 1000000);
  const emailA = `user_A_${uniqueId}@rishtafy-test.com`;
  const emailB = `user_B_${uniqueId}@rishtafy-test.com`;

  test('User B should be able to send interest to User A', async ({ page }) => {
    // 1. Setup User A (Receiver)
    await page.goto('/register');
    await page.getByPlaceholder('Your full name').fill('Receiver User');
    await page.getByPlaceholder('your@email.com').fill(emailA);
    await page.getByPlaceholder('Min. 8 characters').fill('password123');
    await page.getByPlaceholder('Re-enter password').fill('password123');
    await page.getByRole('button', { name: 'Create Account' }).click();
    await expect(page).toHaveURL(/.*profile\/edit/);
    
    // 2. Setup User B (Sender)
    await page.goto('/register');
    await page.getByPlaceholder('Your full name').fill('Sender User');
    await page.getByPlaceholder('your@email.com').fill(emailB);
    await page.getByPlaceholder('Min. 8 characters').fill('password123');
    await page.getByPlaceholder('Re-enter password').fill('password123');
    await page.getByRole('button', { name: 'Create Account' }).click();
    await expect(page).toHaveURL(/.*profile\/edit/);

    // 3. Find User A in Search
    await page.goto('/search');
    await page.waitForTimeout(2000); // Wait for results
    
    const userACard = page.locator('.profile-card').filter({ hasText: 'Receiver User' }).first();
    await expect(userACard).toBeVisible();

    // 4. Send Interest
    await page.waitForTimeout(2000); // Allow frontend to fully load
    
    // Set up dialog listener before click
    const dialogPromise = page.waitForEvent('dialog');
    await userACard.getByRole('button', { name: 'Send Interest' }).click();
    
    const dialog = await dialogPromise;
    expect(dialog.message()).toContain('Interest request sent successfully');
    await dialog.accept();

    // 5. Verify in Sent Requests
    await page.goto('/requests', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'Sent' }).click();
    await page.waitForTimeout(1000);
    await expect(page.locator('.request-card').filter({ hasText: 'Receiver User' }).first()).toBeVisible();
  });
});
