import { test, expect } from "@playwright/test";
/*
Database should contain:
1. an admin user - {email: admin@admin.com, password: admin}
2. a category - {{
  "name": "Home & Living",
  "slug": "home-and-living",
}}
*/
test.use({ launchOptions: { slowMo: 500 } });

test.describe("admin create product", async () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/");
    await page.getByText("LOGIN").click();
    await page.getByPlaceholder("Enter Your Email").fill("admin@sys.com");
    await page.getByPlaceholder("Enter Your Password").fill("admin");
    await page.getByRole("button", { name: "LOGIN" }).click();
    page.waitForURL("http://localhost:3000/");
  });
  // logout after each test flow
  test.afterEach(async ({ page }) => {
    await page.getByRole("button", { name: "ADMIN" }).click();
    await page.getByText("LOGOUT").click();
  });
  test("login -> go to dashboard -> create product -> product created -> logout", async ({
    page,
  }) => {
    await page.getByText("ADMIN").click();
    await page.getByText("DASHBOARD").click();
    await page.waitForURL("http://localhost:3000/dashboard/admin", {
      timeout: 100000,
    });
    await page.getByText("Create Product").click();
    await page.waitForURL(
      "http://localhost:3000/dashboard/admin/create-product",
      { timeout: 100000 }
    );
    await page.locator("#rc_select_0").click();
    await page.locator("[title='Home & Living']").click();
    await page
      .getByText("Upload Photo")
      .setInputFiles("tests/uploadFiles/tissue.jpg");
    await page
      .getByPlaceholder("write a name")
      .fill("Facial Tissue 2 Ply 180 sheets/box 180x185mm");
    await page.getByPlaceholder("write a description").fill("Facial Tissue");
    await page.getByPlaceholder("write a Price").fill("4.98");
    await page.getByPlaceholder("write a quantity").fill("1000");
    await page.locator("#rc_select_1").click();
    await page.locator("[title='Yes']").click();
    await page.getByRole("button", { name: "CREATE PRODUCT" }).click();
    await page.waitForURL("http://localhost:3000/dashboard/admin/products", {
      timeout: 100000,
    });
    await page.reload();
    expect(
      page.getByText("Facial Tissue 2 Ply 180 sheets/box 180x185mm").first()
    ).toBeVisible();
  });
});
