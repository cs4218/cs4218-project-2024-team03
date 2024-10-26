import { test, expect } from "@playwright/test";
/*
Database should contain:
1. a user - {email: user@user.com, password: user}
2. 2 categories:
{
  "id": "671c67e1d0715ecfc865f355",
  "name": "Beverages",
  "slug": "beverages",
  "__v": 0
},{
  "id": "671c67e4d0715ecfc865f35a",
  "name": "Snacks",
  "slug": "snacks",
  "__v": 0
}
3. product(s) under the above category - 
{
  "name": "Pocky",
  "description": "Pocky",
  "price": 3,
  "category": {
    "$oid": "671c67e4d0715ecfc865f35a"
  },
  "quantity": 200,
},
{
  "name": "M&M's",
  "description": "M&M's chocolate",
  "price": 5,
  "category": {
    "$oid": "671c67e4d0715ecfc865f35a"
  },
  "quantity": 90,
},
{
  "name": "milo",
  "description": "milo",
  "price": 8,
  "category": {
    "$oid": "671c67e1d0715ecfc865f355"
  },
  "quantity": 5,
}
unspecified fields can assume any valid value
*/

test.use({ launchOptions: { slowMo: 1000 } });

test.describe("user view all categories and view products by category flow", () => {
  // Login before each test flow
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/");
    await page.getByText("LOGIN").click();
    await page.getByPlaceholder("Enter Your Email").fill("user@user.com");
    await page.getByPlaceholder("Enter Your Password").fill("user");
    await page.getByRole("button", { name: "LOGIN" }).click();
    page.waitForURL("http://localhost:3000/");
  });

  // Logout after each test flow
  test.afterEach(async ({ page }) => {
    await page.getByRole("button", { name: "USER" }).click();
    await page.getByText("LOGOUT").click();
  });

  // Test case for navigating categories and viewing products
  test("login-> view all categories -> view product by Category -> logout", async ({ page }) => {
    await page.getByRole("link", { name: "CATEGORIES" }).click();
    await page.getByRole("link", { name: "ALL CATEGORIES" }).click();
    await page.waitForURL("http://localhost:3000/categories", { timeout: 10000 });

    // Check if "Beverages" link is visible
    await expect(page.getByRole("link", { name: "Beverages" })).toBeVisible();
    // Check if "Snacks" link is visible
    await expect(page.getByRole("link", { name: "Snacks" })).toBeVisible();

    // Click on Beverages category link
    await page.getByRole("link", { name: "Beverages" }).click();
    await page.waitForURL("http://localhost:3000/category/beverages", { timeout: 10000 });

    // Verify "Category - Beverages" header is visible
    await expect(page.getByText("Category - Beverages").first()).toBeVisible();

    // Check if the product "milo" is visible under the Beverages category
    await expect(page.getByText("milo").first()).toBeVisible();
  });
});
