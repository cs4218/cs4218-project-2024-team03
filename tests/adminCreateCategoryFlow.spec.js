import { test, expect } from "@playwright/test";

test.use({ launchOptions: { slowMo: 500 } });

test.describe("admin create, update and delete category", async () => {
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
  test("login -> go to dashboard -> create category -> update category -> delete category -> logout", async ({
    page,
  }) => {
    await page.getByText("ADMIN").click();
    await page.getByText("DASHBOARD").click();
    await page.waitForURL("http://localhost:3000/dashboard/admin", {
      timeout: 100000,
    });
    await page.getByText("Create Category").click();
    await page.waitForURL(
      "http://localhost:3000/dashboard/admin/create-category",
      { timeout: 100000 }
    );

    await page
      .getByPlaceholder("Enter new category")
      .fill("New Category1")
      
    await page.getByRole("button", { name: "Submit" }).click();
    await page.waitForURL("http://localhost:3000/dashboard/admin/create-category", {
      timeout: 100000,
    });
    await page.reload();

    await page.getByRole("button", { name: "Edit" }).last().click();
    await page.getByPlaceholder('Enter New Category').last().fill('Updated Category');
    await page.getByRole("button", { name: "Submit" }).last().click();
    
    await page.waitForURL("http://localhost:3000/dashboard/admin/create-category", {
      timeout: 100000,
    });
    await page.reload();

    await page.getByRole("button", { name: "Delete" }).last().click();
    // await page.getByText("Are you sure you want to delete this category?").click();

    await page.reload();
    expect(await page.getByText("Updated Category").first()).not.toBeVisible();
  });
});
