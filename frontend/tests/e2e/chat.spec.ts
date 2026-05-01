import { test, expect } from '@playwright/test';

test.describe('Real-Time Chat and Privacy Flow (Sprint 3)', () => {
  const uniqueId = Math.floor(Math.random() * 1000000);
  const userAName = `User A ${uniqueId}`;
  const userBName = `User B ${uniqueId}`;
  const userAEmail = `userA_${uniqueId}@rishtafy-test.com`;
  const userBEmail = `userB_${uniqueId}@rishtafy-test.com`;

  test('Users can connect, unblur photos, and chat in real-time', async ({ browser }) => {
    // Create two separate browser contexts for real-time testing
    const contextA = await browser.newContext();
    const contextB = await browser.newContext();
    const pageA = await contextA.newPage();
    const pageB = await contextB.newPage();

    // 1. Register User A
    await pageA.goto('http://127.0.0.1:5173/register');
    await pageA.getByPlaceholder('Your full name').fill(userAName);
    await pageA.getByPlaceholder('your@email.com').fill(userAEmail);
    await pageA.getByPlaceholder('Min. 8 characters').fill('password123');
    await pageA.getByPlaceholder('Re-enter password').fill('password123');
    await pageA.getByRole('button', { name: /Candidate/i }).click();
    await pageA.getByRole('button', { name: 'Create Account' }).click();
    await expect(pageA).toHaveURL(/.*profile\/edit/);

    // 2. Register User B
    await pageB.goto('http://127.0.0.1:5173/register');
    await pageB.getByPlaceholder('Your full name').fill(userBName);
    await pageB.getByPlaceholder('your@email.com').fill(userBEmail);
    await pageB.getByPlaceholder('Min. 8 characters').fill('password123');
    await pageB.getByPlaceholder('Re-enter password').fill('password123');
    await pageB.getByRole('button', { name: /Candidate/i }).click();
    await pageB.getByRole('button', { name: 'Create Account' }).click();
    await expect(pageB).toHaveURL(/.*profile\/edit/);

    // 3. User A searches and sends interest to User B
    await pageA.goto('http://127.0.0.1:5173/search');
    await pageA.waitForLoadState('networkidle');
    const userBCard = pageA.locator('.profile-card').filter({ hasText: userBName }).first();
    await expect(userBCard).toBeVisible({ timeout: 10000 });
    
    // Privacy Check: User B's photo should be blurred in search
    await expect(userBCard.getByText('🔒 Photo blurred')).toBeVisible();

    const dialogPromise = pageA.waitForEvent('dialog');
    await userBCard.getByRole('button', { name: 'Send Interest' }).click();
    const dialog = await dialogPromise;
    await dialog.accept();

    // 4. User B accepts the interest
    await pageB.goto('http://127.0.0.1:5173/requests');
    const requestCard = pageB.locator('.request-card').filter({ hasText: userAName }).first();
    await expect(requestCard).toBeVisible({ timeout: 10000 });
    
    // Set up dialog listener for the 'Accept' alert
    const acceptDialogPromise = pageB.waitForEvent('dialog');
    await requestCard.getByRole('button', { name: 'Accept' }).click();
    const acceptDialog = await acceptDialogPromise;
    await acceptDialog.accept();

    // 5. User A goes to Connections and sees User B (Unblurred)
    // Small wait to allow the connection insertion to finish in the background
    await pageA.waitForTimeout(2000); 
    await pageA.goto('http://127.0.0.1:5173/connections');
    const connectionCardA = pageA.locator('.bg-white').filter({ hasText: userBName }).first();
    await expect(connectionCardA).toBeVisible({ timeout: 10000 });
    // Privacy Check: "Photos unblurred" text should be visible in the connection card footer
    await expect(connectionCardA.getByText('Photos unblurred')).toBeVisible();

    // 6. User B goes to Connections and sees User A
    await pageB.goto('http://127.0.0.1:5173/connections');
    const connectionCardB = pageB.locator('.bg-white').filter({ hasText: userAName }).first();
    await expect(connectionCardB).toBeVisible({ timeout: 10000 });

    // 7. REAL-TIME CHAT TEST
    // User A enters chat
    await connectionCardA.getByRole('button', { name: 'Chat' }).click();
    await expect(pageA).toHaveURL(/.*chat\/.*/);
    await expect(pageA.getByText('Start the conversation')).toBeVisible();

    // User B enters chat
    await connectionCardB.getByRole('button', { name: 'Chat' }).click();
    await expect(pageB).toHaveURL(/.*chat\/.*/);

    // WAIT for both to be online (Synchronization)
    // This is critical for real-time broadcast to work reliably in tests
    await expect(pageA.locator('.online-status')).toBeVisible({ timeout: 15000 });
    await expect(pageB.locator('.online-status')).toBeVisible({ timeout: 15000 });

    // User A sends a message
    const testMessage = `Hello from User A! Code: ${uniqueId}`;
    await pageA.getByPlaceholder('Type a message...').fill(testMessage);
    // Target the button specifically inside the form
    await pageA.locator('form button[type="submit"]').click();

    // User A should see their own message
    await expect(pageA.getByText(testMessage)).toBeVisible({ timeout: 10000 });

    // User B should receive the message in REAL-TIME (no refresh!)
    await expect(pageB.getByText(testMessage)).toBeVisible({ timeout: 15000 });

    // User B replies
    const replyMessage = `Hi User A! I got it. Code: ${uniqueId}`;
    await pageB.getByPlaceholder('Type a message...').fill(replyMessage);
    await pageB.locator('form button[type="submit"]').click();

    // User A should receive the reply in REAL-TIME
    await expect(pageA.getByText(replyMessage)).toBeVisible({ timeout: 15000 });

    // Clean up
    await contextA.close();
    await contextB.close();
  });
});
