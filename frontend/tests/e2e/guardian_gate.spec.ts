import { test, expect } from '@playwright/test';

test.describe('Guardian Gate Flow (Sprint 2/3)', () => {
  const uniqueId = Math.floor(Math.random() * 1000000);
  const candidateName = `Test Candidate ${uniqueId}`;
  const guardianName = `Test Guardian ${uniqueId}`;
  const senderName = `Interest Sender ${uniqueId}`;
  const candidateEmail = `candidate_${uniqueId}@rishtafy-test.com`;
  const guardianEmail = `guardian_${uniqueId}@rishtafy-test.com`;

  test('Guardian should be able to approve a request for their candidate', async ({ page }) => {
    // Capture browser console logs
    page.on('console', msg => console.log(`[Browser] ${msg.type()}: ${msg.text()}`));
    page.on('pageerror', err => console.log(`[Browser Error] ${err.message}`));

    // 1. Setup Candidate
    await page.goto('/register');
    await page.getByPlaceholder('Your full name').fill(candidateName);
    await page.getByPlaceholder('your@email.com').fill(candidateEmail);
    await page.getByPlaceholder('Min. 8 characters').fill('password123');
    await page.getByPlaceholder('Re-enter password').fill('password123');
    await page.getByRole('button', { name: /Candidate/i }).click();
    await page.getByRole('button', { name: 'Create Account' }).click();
    await expect(page).toHaveURL(/.*profile\/edit/);
    
    // 2. Setup Guardian for this Candidate
    await page.goto('/register');
    await page.getByPlaceholder('Your full name').fill(guardianName);
    await page.getByPlaceholder('your@email.com').fill(guardianEmail);
    await page.getByPlaceholder('Min. 8 characters').fill('password123');
    await page.getByPlaceholder('Re-enter password').fill('password123');
    await page.getByRole('button', { name: /Guardian/i }).click();
    // Fill the link candidate field
    await page.getByPlaceholder('candidate@email.com').fill(candidateEmail);
    await page.getByRole('button', { name: 'Create Account' }).click();
    await expect(page).toHaveURL(/.*dashboard/); // Guardians go to dashboard

    // 3. Register a Sender to send interest to Candidate
    const senderEmail = `sender_${uniqueId}@rishtafy-test.com`;
    await page.goto('/register');
    await page.getByPlaceholder('Your full name').fill(senderName);
    await page.getByPlaceholder('your@email.com').fill(senderEmail);
    await page.getByPlaceholder('Min. 8 characters').fill('password123');
    await page.getByPlaceholder('Re-enter password').fill('password123');
    await page.getByRole('button', { name: /Candidate/i }).click();
    await page.getByRole('button', { name: 'Create Account' }).click();
    
    // WAIT for registration to complete
    await expect(page).toHaveURL(/.*profile\/edit/);

    // 4. Send Interest
    await page.goto('/search');
    await page.waitForLoadState('networkidle');
    
    // Explicitly wait for the profile card to appear
    const candidateCard = page.locator('.profile-card').filter({ hasText: candidateName }).first();
    await expect(candidateCard).toBeVisible({ timeout: 10000 });
    
    // Set up dialog listener before clicking
    const dialogPromise = page.waitForEvent('dialog');
    await candidateCard.getByRole('button', { name: 'Send Interest' }).click();
    const dialog = await dialogPromise;
    console.log(`[Test] Dialog caught: ${dialog.message()}`);
    expect(dialog.message()).toContain('successfully');
    await dialog.accept();
    
    // 5. Login as Guardian to Approve
    // Clear session to simulate a different browser/computer
    await page.evaluate(() => localStorage.clear());
    await page.goto('/login');
    await page.getByPlaceholder('your@email.com').fill(guardianEmail);
    await page.getByPlaceholder('••••••••').fill('password123');
    await page.getByRole('button', { name: 'Sign in' }).click();

    // WAIT for login to complete and redirect to dashboard
    await expect(page).toHaveURL(/.*dashboard/);

    await page.goto('/guardian/requests');
    await expect(page.getByText(senderName)).toBeVisible({ timeout: 10000 });
    await page.getByRole('button', { name: 'Approve & Forward' }).click();
    
    await expect(page.getByText('Request approved and forwarded')).toBeVisible();
  });
});
