import { test, expect } from '@playwright/test';

test.describe('Rishtafy: The Master Journey (Sprint 1-3)', () => {
  const uniqueId = Math.floor(Math.random() * 1000000);
  const userAName = `Farhan ${uniqueId}`;
  const userBName = `Amna ${uniqueId}`;
  const userAEmail = `farhan_${uniqueId}@rishtafy-test.com`;
  const userBEmail = `amna_${uniqueId}@rishtafy-test.com`;

  test('The Complete Core Flow: Landing to Connection to Real-Time Chat', async ({ browser }) => {
    // We use two browsers to simulate the real interaction
    const contextA = await browser.newContext();
    const contextB = await browser.newContext();
    const pageA = await contextA.newPage();
    const pageB = await contextB.newPage();

    // --- STEP 1: LANDING & REGISTRATION ---
    console.log('Step 1: Verifying Landing and Registering Candidates...');
    await pageA.goto('http://127.0.0.1:5173');
    await expect(pageA.getByText(/Find Your Partner With Purpose/i)).toBeVisible();
    
    // Register Farhan
    await pageA.goto('http://127.0.0.1:5173/register');
    await pageA.getByPlaceholder('Your full name').fill(userAName);
    await pageA.getByPlaceholder('your@email.com').fill(userAEmail);
    await pageA.getByPlaceholder('Min. 8 characters').fill('password123');
    await pageA.getByPlaceholder('Re-enter password').fill('password123');
    await pageA.getByRole('button', { name: /Candidate/i }).click();
    await pageA.getByRole('button', { name: 'Create Account' }).click();
    await expect(pageA).toHaveURL(/.*profile\/edit/);

    // Register Amna
    await pageB.goto('http://127.0.0.1:5173/register');
    await pageB.getByPlaceholder('Your full name').fill(userBName);
    await pageB.getByPlaceholder('your@email.com').fill(userBEmail);
    await pageB.getByPlaceholder('Min. 8 characters').fill('password123');
    await pageB.getByPlaceholder('Re-enter password').fill('password123');
    await pageB.getByRole('button', { name: /Candidate/i }).click();
    await pageB.getByRole('button', { name: 'Create Account' }).click();
    await expect(pageB).toHaveURL(/.*profile\/edit/);

    // --- STEP 2: SEARCH & PRIVACY ---
    console.log('Step 2: Searching and Verifying Privacy (Photo Blurring)...');
    await pageA.goto('http://127.0.0.1:5173/search');
    await pageA.waitForLoadState('networkidle');
    const amnaCard = pageA.locator('.profile-card').filter({ hasText: userBName }).first();
    await expect(amnaCard).toBeVisible({ timeout: 10000 });
    
    // Farhan sees Amna's photo as blurred (Privacy Mandate)
    await expect(amnaCard.getByText(/Photo blurred/i)).toBeVisible();

    // --- STEP 3: MATCHMAKING ---
    console.log('Step 3: Sending and Accepting Interest...');
    const dialogPromise = pageA.waitForEvent('dialog');
    await amnaCard.getByRole('button', { name: 'Send Interest' }).click();
    const dialog = await dialogPromise;
    await dialog.accept();

    // Amna sees the request
    await pageB.goto('http://127.0.0.1:5173/requests');
    const farhanRequest = pageB.locator('.request-card').filter({ hasText: userAName }).first();
    await expect(farhanRequest).toBeVisible({ timeout: 10000 });
    
    // Amna accepts the match
    const acceptDialogPromise = pageB.waitForEvent('dialog');
    await farhanRequest.getByRole('button', { name: 'Accept' }).click();
    const acceptDialog = await acceptDialogPromise;
    await acceptDialog.accept();

    // --- STEP 4: THE REVEAL & CONNECTION ---
    console.log('Step 4: Verifying the Connection and Photo Reveal...');
    // Farhan goes to connections
    await pageA.waitForTimeout(2000); // Allow DB sync
    await pageA.goto('http://127.0.0.1:5173/connections');
    const amnaConnection = pageA.locator('.bg-white').filter({ hasText: userBName }).first();
    await expect(amnaConnection).toBeVisible({ timeout: 10000 });
    
    // Photos are now unblurred!
    await expect(amnaConnection.getByText(/Photos unblurred/i)).toBeVisible();

    // --- STEP 5: REAL-TIME CHAT ---
    console.log('Step 5: Verifying Real-Time Communication...');
    await amnaConnection.getByRole('button', { name: 'Chat' }).click();
    
    // Amna enters chat
    await pageB.goto('http://127.0.0.1:5173/connections');
    await pageB.locator('.bg-white').filter({ hasText: userAName }).first().getByRole('button', { name: 'Chat' }).click();

    // WAIT for both to be online (Synchronization)
    console.log('Waiting for both users to connect to the real-time channel...');
    await expect(pageA.locator('.online-status')).toBeVisible({ timeout: 15000 });
    await expect(pageB.locator('.online-status')).toBeVisible({ timeout: 15000 });

    // Farhan sends a greeting
    const farhanMsg = `Assalam o Alaikum, Amna! This is Farhan. ${uniqueId}`;
    await pageA.getByPlaceholder('Type a message...').fill(farhanMsg);
    await pageA.locator('form button[type="submit"]').click();

    // Amna receives it INSTANTLY
    await expect(pageB.getByText(farhanMsg)).toBeVisible({ timeout: 15000 });

    // Amna replies
    const amnaReply = `Walaikum Assalam, Farhan! I received your message. ${uniqueId}`;
    await pageB.getByPlaceholder('Type a message...').fill(amnaReply);
    await pageB.locator('form button[type="submit"]').click();

    // Farhan receives the reply INSTANTLY
    await expect(pageA.getByText(amnaReply)).toBeVisible({ timeout: 15000 });

    console.log('MASTER JOURNEY COMPLETE: Rishtafy Core is 100% Operational!');

    await contextA.close();
    await contextB.close();
  });
});
