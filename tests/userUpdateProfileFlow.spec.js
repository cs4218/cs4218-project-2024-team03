import { test, expect } from '@playwright/test';
import userModel from '../models/userModel';
import mongoose from "mongoose";
import dotenv from 'dotenv';
import { hashPassword } from '../helpers/authHelper';

dotenv.config({ path: './.env' });

test.describe('user update profile flow', () => {
  test.beforeEach(async () => {
    await mongoose.connect(process.env.MONGO_URL);
    await mongoose.connection.createCollection('users');

    const hashedPassword = await hashPassword("password");
    const user = new userModel({
      name: "newUser", 
      email: "email@email.com", 
      password: hashedPassword,
      phone: "12345678", 
      address: "123 address", 
      answer: "safeAnswer", 
      role: 0
  });

    await user.save();
  })

  test.afterEach(async() => {
    await userModel.deleteOne({ email: "email@email.com" });
    await mongoose.disconnect();
  })

  test("login -> dashboard -> profile -> update profile -> logout", async ({ page }) => {
    await page.goto("http://localhost:3000/");
    await page.getByText("LOGIN").click();
    await page.getByPlaceholder("Enter Your Email").fill("email@email.com");
    await page.getByPlaceholder("Enter Your Password").fill("password");
    await page.getByRole("button", { name: "LOGIN" }).click();
    await page.waitForURL("http://localhost:3000/");

    await page.getByRole("button", { name: "NEWUSER"}).click();
    await page.getByText("Dashboard").click();

    await page.getByText("Profile").click();

    await page.getByPlaceholder("Enter Your Name").fill("newName1");
    await page.getByPlaceholder("Enter Your Password").fill("newPassword1");
    await page.getByPlaceholder("Enter Your Phone").fill("87654321");
    await page.getByPlaceholder("Enter Your Address").fill("321 address");

    await page.getByRole("button", { name: "UPDATE" }).click();

    expect(await page.locator('input[placeholder="Enter Your Name"]').inputValue()).toBe("newName1");
    expect(await page.locator('input[placeholder="Enter Your Phone"]').inputValue()).toBe("87654321");
    expect(await page.locator('input[placeholder="Enter Your Address"]').inputValue()).toBe("321 address");

  
    await page.getByRole("button", { name: "NEWUSER"}).click();
    await page.getByText("LOGOUT").click();
  })

  // this get into error as the frontend does not check the object returned and update the user auth field with an empty user object when error is returned
  test.fail("login -> dashboard -> profile -> update profile password with character less than 6 -> logout", async ({ page }) => {
    await page.goto("http://localhost:3000/");
    await page.getByText("LOGIN").click();
    await page.getByPlaceholder("Enter Your Email").fill("email@email.com");
    await page.getByPlaceholder("Enter Your Password").fill("password");
    await page.getByRole("button", { name: "LOGIN" }).click();
    await page.waitForURL("http://localhost:3000/");

    await page.getByRole("button", { name: "NEWUSER"}).click();
    await page.getByText("Dashboard").click();

    await page.getByText("Profile").click();

    await page.getByPlaceholder("Enter Your Password").fill("123");

    await page.getByRole("button", { name: "UPDATE" }).click();

    await expect(page.getByText("Passsword is required and 6 character long")).toBeVisible();

    await page.getByRole("button", { name: "NEWUSER"}).click();
    await page.getByText("LOGOUT").click();
  })
})