import { test, expect } from "@playwright/test";
/*
Database should contain:
1. a user - {email: user@user.com, password: user, address: 123 Test Street}
unspecified fields can assume any valid value
*/
test.use({ launchOptions: { slowMo: 1000 } });
test.describe("user update address from cartpage flow", async () => {
  // login before each test flow
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/");
    await page.getByText("LOGIN").click();
    await page.getByPlaceholder("Enter Your Email").fill("user@user.com");
    await page.getByPlaceholder("Enter Your Password").fill("user");
    await page.getByRole("button", { name: "LOGIN" }).click();
    page.waitForURL("http://localhost:3000/");
  });
  // logout after each test flow
  test.afterEach(async ({ page }) => {
    await page.getByRole("button", { name: "USER" }).click();
    await page.getByText("LOGOUT").click();
  });

  test("login -> cart page -> update address -> check updated address -> logout", async ({ page }) => {
    // go to the cart page
    await page.getByRole("link", { name: "CART" }).click();
    await page.waitForURL("http://localhost:3000/cart", {
      timeout: 100000,
    });

    // click update address
    await page.getByText("Update Address").click();
    await page.waitForURL("http://localhost:3000/dashboard/user/profile", {
      timeout: 100000,
    });

    // update address
    await page
      .getByPlaceholder("Enter Your Address")
      .fill("new 123 Test Address");
    await page.getByText("UPDATE").click();

    // check updated address in cart page
    // go to the cart page
    await page.getByRole("link", { name: "CART" }).click();
    await page.waitForURL("http://localhost:3000/cart", {
      timeout: 100000,
    });

    await expect(page.getByText("new 123 Test Address").first()).toBeVisible();
  });
});
