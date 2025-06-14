import { test, expect } from '@playwright/test';

test.describe('Game Page Tests', () => {
  const gameId = 'fraction-fling'; // Example game
  const gameUrl = `/game/${gameId}`;
  const gameTitle = 'Fraction Fling'; // From the example

  test('Game page loads with expected elements', async ({ page }) => {
    await page.goto(gameUrl);

    await expect(page).toHaveTitle(`Playing: ${gameTitle} - Water Classroom`);
    await expect(page.getByRole('heading', { name: `Playing: ${gameTitle}`, level: 1 })).toBeVisible();

    // These elements would be on the actual game page
    await expect(page.getByText('Score: 0')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Start Game' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Quit Game' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Back to Curriculum' })).toBeVisible();
  });

  test('Game actions trigger placeholder alerts or navigation', async ({ page }) => {
    await page.goto(gameUrl);

    // Listener for placeholder alerts
    page.on('dialog', async dialog => {
      const message = dialog.message();
      if (message.includes('Starting')) {
        expect(message).toBe(`Starting ${gameTitle}!... (Placeholder)`);
      } else if (message.includes('Quitting')) {
        expect(message).toBe(`Quitting ${gameTitle}... (Placeholder)`);
      }
      await dialog.accept();
    });

    // Test "Start Game" button
    await page.getByRole('button', { name: 'Start Game' }).click();
    await page.waitForEvent('dialog', { timeout: 1000 }); // Short timeout as it might be a 404

    // Test "Quit Game" button
    await page.getByRole('button', { name: 'Quit Game' }).click();
    await page.waitForEvent('dialog', { timeout: 1000 });

    // Test "Back to Curriculum" link
    await page.getByRole('link', { name: 'Back to Curriculum' }).click();
    await expect(page).toHaveURL('/curriculum');
  });
});
