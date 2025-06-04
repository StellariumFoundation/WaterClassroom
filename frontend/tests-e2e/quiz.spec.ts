import { test, expect } from '@playwright/test';

test.describe('Quiz Page Tests', () => {
  const quizId = 'ch1-fractions-quiz'; // Example quiz
  const quizUrl = `/quiz/${quizId}`;
  const quizName = 'Chapter 1 Fractions'; // From the example

  test('Quiz page loads with expected elements', async ({ page }) => {
    await page.goto(quizUrl);

    await expect(page).toHaveTitle(`Quiz: ${quizName} - Water Classroom`);
    await expect(page.getByRole('heading', { name: `Quiz: ${quizName}`, level: 1 })).toBeVisible();

    // These elements would be on the actual quiz page
    await expect(page.getByText(/This quiz will test your understanding of basic fractions/i)).toBeVisible(); // Example instruction text
    await expect(page.locator('.question-block').first()).toBeVisible(); // Check for at least one question
    await expect(page.getByRole('button', { name: 'Submit Answers' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Cancel and Back to Curriculum' })).toBeVisible();
  });

  test('Quiz actions trigger placeholder alerts or navigation', async ({ page }) => {
    await page.goto(quizUrl);

    // Listener for placeholder alerts
    page.on('dialog', async dialog => {
      expect(dialog.message()).toBe(`Submitting answers for Quiz: ${quizName}... (Placeholder)`);
      await dialog.accept();
    });

    // Test "Submit Answers" button
    await page.getByRole('button', { name: 'Submit Answers' }).click();
    await page.waitForEvent('dialog', { timeout: 1000 }); // Short timeout

    // Test "Cancel and Back to Curriculum" link
    await page.getByRole('link', { name: 'Cancel and Back to Curriculum' }).click();
    await expect(page).toHaveURL('/curriculum');
  });
});
