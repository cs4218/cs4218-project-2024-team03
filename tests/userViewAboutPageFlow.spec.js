import { test, expect } from '@playwright/test';

/*
Database should contain:
1. a user - {email: user@user.com, password: user}
unspecified fields can assume any valid value
*/

// Apply the slow motion globally
test.use({ launchOptions: { slowMo: 500 } });

test.describe("user view about page flow", () => {
  // Login before each test flow
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/");
    await page.getByText("LOGIN").click();
    await page.getByPlaceholder("Enter Your Email").fill("user@user.com");
    await page.getByPlaceholder("Enter Your Password").fill("user");
    await page.getByRole("button", { name: "LOGIN" }).click();
    await page.waitForURL("http://localhost:3000/");
  });

  // Logout after each test flow
  test.afterEach(async ({ page }) => {
    await page.getByRole("button", { name: "USER" }).click();
    await page.getByText("LOGOUT").click();
  });

  // Test case for navigating to the About page
  test("login -> click about link -> view about page -> return to homepage -> logout", async ({ page }) => {
    await page.getByRole("link", { name: "About" }).click();
    await page.waitForURL("http://localhost:3000/about", {
        timeout: 100000,
    });
    await expect(page.getByText("Add text").first()).toBeVisible();

    // return to homepage
    await page.getByRole("link", { name: "HOME" }).click();
    await page.waitForURL("http://localhost:3000",  {
        timeout: 100000,
    });
  });
});
