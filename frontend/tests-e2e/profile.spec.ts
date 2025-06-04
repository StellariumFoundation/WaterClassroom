import { test, expect } from '@playwright/test';

test.describe('Profile Page', () => {
  test('loads and displays key elements', async ({ page }) => {
    await page.goto('/profile');

    // Verify main heading
    await expect(page.getByRole('heading', { name: 'Profile & Settings', level: 1 })).toBeVisible();

    // Check for card headers
    await expect(page.getByRole('heading', { name: 'My Information', level: 2 })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Account Settings', level: 2 })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Curriculum Preference', level: 2 })).toBeVisible();

    // Verify Logout button
    await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible();

    // Verify Change Curriculum button
    const changeCurriculumButton = page.getByRole('button', { name: 'Change' });
    await expect(changeCurriculumButton).toBeVisible();
    // Check its link behavior (assuming it's an <a> styled as a button or wrapped in one that navigates)
    // If it's a real button that triggers JS nav, this test needs to click and check URL.
    // For now, let's assume the component structure makes it behave like a link or its parent is a link.
    // The actual component `Profile.svelte` has `<a href="/curriculum" class="button button-secondary">Change</a>`
    await expect(page.getByRole('link', { name: 'Change' })).toHaveAttribute('href', '/curriculum');
  });

  test('Logout button shows placeholder alert', async ({ page }) => {
    await page.goto('/profile');

    page.on('dialog', async dialog => {
      expect(dialog.type()).toBe('alert');
      expect(dialog.message()).toBe('Logging out... (Placeholder)');
      await dialog.accept();
    });

    await page.getByRole('button', { name: 'Logout' }).click();
    await page.waitForEvent('dialog');
  });
});
