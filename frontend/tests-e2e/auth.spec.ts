import { test, expect } from '@playwright/test';

test.describe('Authentication Flows', () => {
  test.describe('Signup Scenarios', () => {
    test('Successful Signup Attempt (Student)', async ({ page }) => {
      await page.goto('/signup');

      // Listen for the dialog
      page.on('dialog', async dialog => {
        expect(dialog.type()).toBe('alert');
        expect(dialog.message()).toContain('Sign Up with Email'); // Placeholder message
        await dialog.accept();
      });

      await page.getByPlaceholder('Enter your email').fill('student@example.com');
      await page.getByPlaceholder('Enter a password').fill('password123');
      await page.getByPlaceholder('Confirm your password').fill('password123');
      await page.getByLabel('I am a Water School student').check();
      await page.getByRole('button', { name: 'Create Account' }).click();

      // The dialog assertion happens within the event handler
      // We might need a small delay or a specific wait for the dialog to ensure the handler runs
      await page.waitForEvent('dialog');
    });

    test('Successful Signup Attempt (Non-Student)', async ({ page }) => {
      await page.goto('/signup');

      page.on('dialog', async dialog => {
        expect(dialog.type()).toBe('alert');
        expect(dialog.message()).toContain('Sign Up with Email'); // Placeholder message
        await dialog.accept();
      });

      await page.getByPlaceholder('Enter your email').fill('nonstudent@example.com');
      await page.getByPlaceholder('Enter a password').fill('password123');
      await page.getByPlaceholder('Confirm your password').fill('password123');
      // Ensure "I am a Water School student" is unchecked (default)
      expect(await page.getByLabel('I am a Water School student').isChecked()).toBe(false);
      await page.getByRole('button', { name: 'Create Account' }).click();
      await page.waitForEvent('dialog');
    });

    test('Password Mismatch', async ({ page }) => {
      await page.goto('/signup');

      page.on('dialog', async dialog => {
        expect(dialog.type()).toBe('alert');
        expect(dialog.message()).toBe('Passwords do not match!');
        await dialog.accept();
      });

      await page.getByPlaceholder('Enter your email').fill('mismatch@example.com');
      await page.getByPlaceholder('Enter a password').fill('password123');
      await page.getByPlaceholder('Confirm your password').fill('password456');
      await page.getByRole('button', { name: 'Create Account' }).click();
      await page.waitForEvent('dialog');
    });

    test('Navigation to Login from Signup', async ({ page }) => {
      await page.goto('/signup');
      await page.getByRole('link', { name: 'Already have an account? Login' }).click();
      await expect(page).toHaveURL('/login');
    });
  });

  test.describe('Login Scenarios', () => {
    test('Successful Login Attempt', async ({ page }) => {
      await page.goto('/login');

      page.on('dialog', async dialog => {
        expect(dialog.type()).toBe('alert');
        expect(dialog.message()).toContain('Login with Email'); // Placeholder message
        await dialog.accept();
      });

      await page.getByPlaceholder('Enter your email').fill('user@example.com');
      await page.getByPlaceholder('Enter your password').fill('password123');
      await page.getByRole('button', { name: 'Login' }).click();
      await page.waitForEvent('dialog');
    });

    test('Navigation to Signup from Login', async ({ page }) => {
      await page.goto('/login');
      await page.getByRole('link', { name: "Don't have an account? Sign Up" }).click();
      await expect(page).toHaveURL('/signup');
    });

    test('Navigation to Password Reset from Login', async ({ page }) => {
      await page.goto('/login');
      await page.getByRole('link', { name: 'Forgot Password?' }).click();
      await expect(page).toHaveURL('/password-reset');
    });
  });
});
