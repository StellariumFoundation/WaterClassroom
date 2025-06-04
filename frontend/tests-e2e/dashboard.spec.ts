import { test, expect } from '@playwright/test';

test.describe('Dashboard Page', () => {
  test('loads and displays key elements', async ({ page }) => {
    await page.goto('/dashboard');

    // Verify main heading
    await expect(page.getByRole('heading', { name: 'Student Dashboard', level: 1 })).toBeVisible();

    // Check for key cards by their h2 headers
    await expect(page.getByRole('heading', { name: 'My Progress', level: 2 })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Current Lesson', level: 2 })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Upcoming Activities', level: 2 })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Resources', level: 2 })).toBeVisible();


    // Verify "View Full Curriculum" link
    const curriculumLink = page.getByRole('link', { name: 'View Full Curriculum' });
    await expect(curriculumLink).toBeVisible();
    await expect(curriculumLink).toHaveAttribute('href', '/curriculum');

    // Example: Check for a specific piece of static text within a card if available
    // This requires knowing the content of those cards.
    // For now, checking headers and the link is a good start.
    // await expect(page.getByText('You are 50% through the current module.')).toBeVisible();
  });
});
