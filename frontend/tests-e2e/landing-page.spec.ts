import { test, expect } from '@playwright/test';

test('landing page has a welcoming title', async ({ page }) => {
  await page.goto('/');
  // Check for the specific H1 content from +page.svelte
  const heading = page.locator('h1');
  await expect(heading).toBeVisible();
  await expect(heading).toHaveText('Welcome to Water Classroom');
});
