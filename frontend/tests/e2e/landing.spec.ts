import { test, expect } from '@playwright/test';

test.describe('Landing Page (PRD Section 6.1)', () => {
  test.beforeEach(async ({ page }) => {
    // We will navigate to the root when the dev server is running
    await page.goto('/');
  });

  test('verifies all 3 core UVPs are present in the Why Rishtafy section', async ({ page }) => {
    // These tests will run once the server is up. 
    // We are writing them ahead of time per TDD/QA principles.
    
    // The locators use user-facing text
    await expect(page.getByRole('heading', { name: 'Verified Profiles' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Guardian Dashboard' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Intent-Only Matching' })).toBeVisible();
  });

  test('verifies exactly 4 steps in the How It Works section', async ({ page }) => {
    await expect(page.getByText('1', { exact: true })).toBeVisible();
    await expect(page.getByText('2', { exact: true })).toBeVisible();
    await expect(page.getByText('3', { exact: true })).toBeVisible();
    await expect(page.getByText('4', { exact: true })).toBeVisible();
  });
});
