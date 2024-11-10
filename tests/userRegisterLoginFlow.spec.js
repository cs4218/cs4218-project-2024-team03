import { test, expect } from "@playwright/test";

test.use({ launchOptions: { slowMo: 400 } });

test.describe("User Registration and Login", () => {

  test("User register and login flow", async ({ page }) => {
    const newUserEmail = `test` + Math.floor(Math.random() * 1000000) + `@test.com`;
    const userData = {
      name: "Test User",
      email: newUserEmail,
      password: "TestPassword123!",
      phone: "1234567890",
      address: "123 Test St",
      DOB: "1990-01-01",
      answer: "Soccer"
    };

    await page.goto("http://localhost:3000/register");
    await page.fill('input[placeholder="Enter Your Name"]', userData.name);
    await page.fill('input[placeholder="Enter Your Email "]', userData.email);
    await page.fill('input[placeholder="Enter Your Password"]', userData.password);
    await page.fill('input[placeholder="Enter Your Phone"]', userData.phone);
    await page.fill('input[placeholder="Enter Your Address"]', userData.address);
    await page.fill('input[placeholder="Enter Your DOB"]', userData.DOB);
    await page.fill('input[placeholder="What is Your Favorite sports"]', userData.answer);

    await page.click("button:has-text('REGISTER')");

    await expect(page.getByText("Register Successfully, please login")).toBeVisible();
    
    await expect(page).toHaveURL("http://localhost:3000/login");

    await page.goto("http://localhost:3000/login");

    await page.fill('input[placeholder="Enter Your Email "]', userData.email);
    await page.fill('input[placeholder="Enter Your Password"]', userData.password);

    await page.click("button:has-text('LOGIN')");

    await expect(page).toHaveURL("http://localhost:3000/");
    await expect(page.getByText(userData.name)).toBeVisible();
  });


  test("Should show an error message when password is wrong, and should login with correct password then.", async ({ page }) => {
    const newUserEmail = `test` + Math.floor(Math.random() * 1000000) + `@test.com`;
    const userData = {
      name: "Test User",
      email: newUserEmail,
      password: "TestPassword123!",
      phone: "1234567890",
      address: "123 Test St",
      DOB: "1990-01-01",
      answer: "Soccer"
    };

    await page.goto("http://localhost:3000/register");
    await page.fill('input[placeholder="Enter Your Name"]', userData.name);
    await page.fill('input[placeholder="Enter Your Email "]', userData.email);
    await page.fill('input[placeholder="Enter Your Password"]', userData.password);
    await page.fill('input[placeholder="Enter Your Phone"]', userData.phone);
    await page.fill('input[placeholder="Enter Your Address"]', userData.address);
    await page.fill('input[placeholder="Enter Your DOB"]', userData.DOB);
    await page.fill('input[placeholder="What is Your Favorite sports"]', userData.answer);

    await page.click("button:has-text('REGISTER')");

    await expect(page.getByText("Register Successfully, please login")).toBeVisible();
    
    await expect(page).toHaveURL("http://localhost:3000/login");

    await page.goto("http://localhost:3000/login");

    await page.fill('input[placeholder="Enter Your Email "]', userData.email);
    await page.fill('input[placeholder="Enter Your Password"]', "wrongPassword");

    await page.click("button:has-text('LOGIN')");

    await expect(page.getByText("Invalid Password")).toBeVisible();

    await page.fill('input[placeholder="Enter Your Password"]', userData.password);

    await page.click("button:has-text('LOGIN')");

    await expect(page).toHaveURL("http://localhost:3000/");
    await expect(page.getByText(userData.name)).toBeVisible();

  });

  test("should not show user details after logout", async ({ page }) => {
    const newUserEmail = `test` + Math.floor(Math.random() * 1000000) + `@test.com`;
    const userData = {
      name: "Test User",
      email: newUserEmail,
      password: "TestPassword123!",
      phone: "1234567890",
      address: "123 Test St",
      DOB: "1990-01-01",
      answer: "Soccer"
    };

    await page.goto("http://localhost:3000/register");
    await page.fill('input[placeholder="Enter Your Name"]', userData.name);
    await page.fill('input[placeholder="Enter Your Email "]', userData.email);
    await page.fill('input[placeholder="Enter Your Password"]', userData.password);
    await page.fill('input[placeholder="Enter Your Phone"]', userData.phone);
    await page.fill('input[placeholder="Enter Your Address"]', userData.address);
    await page.fill('input[placeholder="Enter Your DOB"]', userData.DOB);
    await page.fill('input[placeholder="What is Your Favorite sports"]', userData.answer);

    await page.click("button:has-text('REGISTER')");

    await expect(page.getByText("Register Successfully, please login")).toBeVisible();
    
    await expect(page).toHaveURL("http://localhost:3000/login");

    await page.goto("http://localhost:3000/login");

    await page.fill('input[placeholder="Enter Your Email "]', userData.email);
    await page.fill('input[placeholder="Enter Your Password"]', userData.password);

    await page.click("button:has-text('LOGIN')");

    await expect(page).toHaveURL("http://localhost:3000/");
    await expect(page.getByText(userData.name)).toBeVisible();


    await page.getByRole("button", { name: userData.name }).click();
    await page.click("a:has-text('Logout')");

    await expect(page).toHaveURL("http://localhost:3000/login");
    await page.goto("http://localhost:3000/");
    await expect(page.getByText("Login")).toBeVisible();
    await expect(page.getByText("Register")).toBeVisible();
    await expect(page.getByText(userData.name)).not.toBeVisible();
  });

});
