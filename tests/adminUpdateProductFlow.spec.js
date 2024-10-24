import { test, expect } from "@playwright/test";
/*
Database should contain:
1. an admin user - {email: admin@admin.com, password: admin}
2. a category - {{
  "name": "Home & Living",
  "slug": "home-and-living",
3. a product - {{
  "name": "mdba",
  "slug": "mdba",
  "description": "mongodb",
  "price": 12,
  "quantity": 2,
  "shipping": yes
}}
*/
test.use({ launchOptions: { slowMo: 500 } });

test.describe("admin update product", async () => {
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


  test("login -> go to dashboard -> update product -> check product -> logout", async ({
    page,
  }) => {
    await page.getByText("ADMIN").click();
    await page.getByText("DASHBOARD").click();
    await page.waitForURL("http://localhost:3000/dashboard/admin", {
      timeout: 100000,
    });
    await page.getByText("Products").click();
    await page.getByText("mdba").click();
    await page.waitForURL(
      "http://localhost:3000/dashboard/admin/product/mdba",
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

    await page.locator("#rc_select_1").hover();
    await page.getByText("No").click();    
    await page.locator("[title='Yes']").click();

    await page.getByRole("button", { name: "UPDATE PRODUCT" }).click();
    await page.waitForURL("http://localhost:3000/dashboard/admin/products", {
      timeout: 100000,
    });
    await page.reload();
    expect(
      page.getByText("Facial Tissue").first()
    ).toBeVisible();
    
    await page.getByText("Facial Tissue").click();
    await page.waitForURL(
      "http://localhost:3000/dashboard/admin/product/mdba",
      { timeout: 100000 }
    );
    
    expect(
      page.getByText("Facial Tissue 2 Ply 180 sheets/box 180x185mm").first()
    ).toBeVisible();
    
    expect(
      page.getByText("4.98").first()
    ).toBeVisible();
    expect(
      page.getByText("1000").first()
    ).toBeVisible();
    expect(
      page.getByText("Yes").first()
    ).toBeVisible();
    expect(
      page.getByText("Home & Living").first()
    ).toBeVisible();

    
    await page.getByRole("button", { name: "DELETE PRODUCT" }).click();

    page.on('dialog', async (dialog) => {
      expect(dialog.message()).toContain('Are You Sure want to delete this product ?');
      await dialog.accept();
    });

    expect(
      page.getByText("Facial Tissue").first()
    ).not.toBeVisible();
  });

  
  test("login -> go to dashboard -> delete product -> check product @ dashboard & home -> logout", async ({
    page,
  }) => {
    await page.getByText("ADMIN").click();
    await page.getByText("DASHBOARD").click();
    await page.waitForURL("http://localhost:3000/dashboard/admin", {
      timeout: 100000,
    });
    await page.getByText("Products").click();
    await page.getByText("mdba").click();
    await page.waitForURL(
      "http://localhost:3000/dashboard/admin/product/mdba",
      { timeout: 100000 }
    );
    
    await page.getByRole("button", { name: "DELETE PRODUCT" }).click();

    page.on('dialog', async (dialog) => {
      expect(dialog.message()).toContain('Are You Sure want to delete this product ?');
      await dialog.accept();
    });

    expect(
      page.getByText("mdba").first()
    ).not.toBeVisible();
    
    await page.getByText("HOME").first().click();
    
    expect(
      page.getByText("mdba").first()
    ).not.toBeVisible();
  });
});
