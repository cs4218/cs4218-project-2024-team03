import { test, expect } from "@playwright/test";
/*
Database should contain:
1. a user - {email: user@user.com, password: user}
2. a category - {{
  "name": "Home & Living",
  "slug": "home-and-living",
}}
3. a product under the above category - 
{
  name: "PurSoft 3ply Chocolate Rain Outdoor Soft Pack 120 sheets, Pack of 4"
  description: "tissue",
  price: 4.48,
  quantity: 1000,
}
unspecified fields can assume any valid value
*/
test.use({ launchOptions: { slowMo: 1000 } });
test.describe("user purchase product", async () => {
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
  test.skip("login -> add homepage product to cart -> checkout -> order page -> logout", async ({
    page,
  }) => {
    await page
      .getByText("All Products")
      .locator("+ div .card:first-child .card-body .card-name-price")
      .getByRole("button", { name: "ADD TO CART" })
      .click();
    await page.getByRole("link", { name: "CART" }).click();
    await page.waitForURL("http://localhost:3000/cart");
    await page.locator(".braintree-option__card").click();
    const cardNumberFrame = page
      .getByText("Card Number")
      .locator("+ .braintree-form__field .braintree-form-number")
      .frameLocator("iFrame");
    await cardNumberFrame
      .locator("#credit-card-number")
      .fill("4005519200000004");
    const ExpiryFrame = page
      .getByText("Expiration Date")
      .locator("+ .braintree-form__field .braintree-form-expiration")
      .frameLocator("iFrame");
    await ExpiryFrame.locator("#expiration").fill("0529");
    const CVVFrame = page
      .getByText("CVV")
      .locator("+ .braintree-form__field .braintree-form-cvv")
      .frameLocator("iFrame");
    await CVVFrame.locator("#cvv").fill("111");
    await page.getByText("Make Payment").click();
    await page.waitForURL("http://localhost:3000/dashboard/user/orders", {
      timeout: 100000,
    });
    await expect(
      page
        .getByText(
          "PurSoft 3ply Chocolate Rain Outdoor Soft Pack 120 sheets, Pack of 4"
        )
        .first()
    ).toBeVisible();
  });
  test.fail(
    "login -> view all categories -> home & living -> more details -> cannot add to cart -> logout",
    async ({ page }) => {
      await page.getByTestId("categories-btn").click();
      await page.getByTestId("all-categories").click();
      await page.waitForURL("http://localhost:3000/categories", {
        timeout: 100000,
      });
      await page
        .getByRole("link", { name: "Home & Living" })
        .click({ timeout: 100000 });
      await page.waitForURL("http://localhost:3000/category/home-and-living", {
        timeout: 100000,
      });
      await page
        .locator(".card:first-of-type")
        .getByRole("button", { name: "More Details" })
        .click();
      await page.waitForURL(
        "http://localhost:3000/product/PurSoft-3ply-Chocolate-Rain-Outdoor-Soft-Pack-120-sheets-Pack-of-4"
      );
      const cartCount = parseInt(
        await page.locator(".ant-badge-count").innerText()
      );
      await page.getByRole("button", { name: "ADD TO CART" }).click();
      const cartCountNew = parseInt(
        await page.locator(".ant-badge-count").innerText()
      );
      expect(cartCountNew - cartCount).toEqual(1);
    }
  );
});
