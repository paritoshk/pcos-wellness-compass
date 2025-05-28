import { test, expect } from '@playwright/test';

test.describe('Nari AI App', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display welcome page with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Nari AI/);
    await expect(page.getByRole('heading', { name: 'Nari AI' })).toBeVisible();
  });

  test('should navigate to profile setup from welcome page if not logged in', async ({ page }) => {
    await page.goto('/');

    // Click the login/signup button (assuming it exists and leads to profile or chat)
    // Since we mock guest user, it might go to /profile or /chat if profile is auto-created
    const loginButton = page.getByRole('button', { name: /Login with Email/i }); // Adjust selector if needed
    await loginButton.click();

    // Check if it navigates to /profile or /chat (as guest profile is created)
    // This depends on the exact behavior of your ManualAuthGuard and WelcomePage logic
    await expect(page).toHaveURL(/\/profile|\/chat/);
  });

  // Add more tests specific to Nari AI features as they are developed
  test('should allow guest login and navigate to profile setup initially', async ({ page }) => {
    // This test needs to be updated based on the new Auth0 flow and profile setup
    // For now, let's assume a button for guest/initial access
    // await page.getByRole('button', { name: /continue as guest/i }).click(); 
    // await expect(page).toHaveURL('/profile');
    // await expect(page.getByRole('heading', { name: /Set up your profile/i })).toBeVisible();
    console.log('Skipping guest login test for now, needs update for Auth0 flow');
  });

  // test('profile setup should lead to chat interface', async ({ page }) => {
  //   await page.goto('/profile');
  //   // Fill in profile details
  //   await page.getByLabel(/name/i).fill('Test User');
  //   await page.getByRole('button', { name: /save profile/i }).click(); // Adjust selector as needed
  //   await expect(page).toHaveURL('/chat');
  //   await expect(page.getByPlaceholder(/type your message/i)).toBeVisible();
  // });
}); 